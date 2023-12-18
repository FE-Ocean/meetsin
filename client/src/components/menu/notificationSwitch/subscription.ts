import { addSubscription, deleteSubscription } from "@/firebase/firebase";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utils";

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

    await deleteSubscriptionFromDB();
};

const storeSubscriptionToDB = async (subscription: PushSubscription) => {
    const jsonFormattedSubscription = JSON.parse(JSON.stringify(subscription));
    const userKey = await addSubscription(jsonFormattedSubscription);

    setLocalStorage("firebaseUserKey", userKey!);
};

const deleteSubscriptionFromDB = async () => {
    const userKey = getLocalStorage("firebaseUserKey");
    await deleteSubscription(userKey);

    removeLocalStorage("firebaseUserKey");
};
