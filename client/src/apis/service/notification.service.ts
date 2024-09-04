import { useMutation } from "@tanstack/react-query";
import {
    createSubscriptionToDB,
    deleteSubscriptionFromDB,
    createPushNotification,
} from "../repository/notification.repository";
import { ISubscription } from "@/types/subscription.type";

const getServiceWorkerStatus = async () => {
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

        return subscription;
    } catch (error) {
        console.error(error);
        if (Notification.permission === "denied") {
            alert("알림 허용해주세요");
        }
    }
};

const formatSubscription = async (subscription: PushSubscription) => {
    const { endpoint, keys } = subscription.toJSON();
    const subscriptionObject: ISubscription = {
        endpoint: endpoint!,
        keys: {
            p256dh: keys!.p256dh,
            auth: keys!.auth,
        },
    };

    return subscriptionObject;
};

export const cancelSubscription = async () => {
    const existingSubscription = await getExistingSubscription();

    if (!existingSubscription) {
        return; // 취소할 구독이 없다.
    }

    existingSubscription.unsubscribe();

    return true;
};

export const useCreateSubscriptionToDB = () => {
    return useMutation({
        mutationFn: async ({ subscription }: { subscription: PushSubscription }) => {
            const subscriptionObject = await formatSubscription(subscription);
            return await createSubscriptionToDB(subscriptionObject);
        },
    });
};

export const useDeleteSubscriptionFromDB = () => {
    return useMutation({
        mutationFn: () => deleteSubscriptionFromDB(),
    });
};

export const useCreatePushNotification = () => {
    return useMutation({
        mutationFn: async ({ roomId }: { roomId: string }) => {
            return await createPushNotification(roomId);
        },
    });
};
