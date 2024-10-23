import { baseClient } from "@/modules/fetchClient";
import { ISubscription } from "@/types/subscription.type";

export const createSubscriptionToDB = async (subscription: ISubscription) => {
    return await baseClient.post("/notification", { notification: subscription });
};

export const deleteSubscriptionFromDB = async () => {
    return await baseClient.delete("/notification");
};

export const createPushNotification = async (roomId: string) => {
    return await baseClient.post(`/notification/${roomId}`);
};
