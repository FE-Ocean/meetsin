import {
    createSubscriptionToDB,
    deleteSubscriptionFromDB,
} from "@/app/api/repository/notification.repository";
// import { addSubscription, deleteSubscription } from "@/firebase/firebase";

const accessToken = "temp"; // 임시

export const getServiceWorkerStatus = async () => {
    return navigator.serviceWorker.ready;
};

export const getExistingSubscription = async () => {
    const serviceWorker = await getServiceWorkerStatus();
    return serviceWorker.pushManager.getSubscription();
};

export const startSubscription = async () => {
    try {
        if (!("PushManager" in window)) {
            alert("푸시 알림 이 브라우저에서 지원 안 함");
            return;
        }

        const existingSubscription = await getExistingSubscription();

        if (existingSubscription) {
            return; // 이미 구독 있음
        }

        const serviceWorker = await getServiceWorkerStatus();

        const subscription = await serviceWorker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
        });

        await storeSubscriptionToDB(subscription);
    } catch (error) {
        console.error(error);
        if (Notification.permission === "denied") {
            alert("알림 허용해주세요");
        }
    }
};

export const cancelSubscription = async () => {
    const existingSubscription = await getExistingSubscription();

    if (!existingSubscription) {
        return; // 취소할 구독이 없다.
    }

    existingSubscription.unsubscribe();

    await deleteSubscriptionFromDB(accessToken);
};

const storeSubscriptionToDB = async (subscription: PushSubscription) => {
    // 포멧 정리해서 디비에 저장
    const jsonFormattedSubscription = JSON.parse(JSON.stringify(subscription));
    const formatNotificationData = {
        endpoint: jsonFormattedSubscription.endpoint,
        keys: {
            p256dh: jsonFormattedSubscription.keys.p256dh,
            auth: jsonFormattedSubscription.keys.auth,
        },
    }; // 추후 서비스에서 해야함

    await createSubscriptionToDB(formatNotificationData, accessToken);
};

export const postNotification = async () => {
    const response = await fetch("/api/notification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw Error("Failed to send push subscription to server");
    }
};
