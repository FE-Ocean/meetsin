import { baseClient } from "@/modules/fetchClient";
import { INotification } from "@/types/notification.type";

export const createSubscriptionToDB = async (subscription: INotification, accessToken: string) => {
    try {
        if (!accessToken) {
            throw new Error("access token이 없거나 올바르지 않습니다.");
        }

        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/notification`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ notification: subscription }),
        });

        if (!response.ok) {
            throw new Error(`DB에 저장 실패: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteSubscriptionFromDB = async (accessToken: string) => {
    if (!accessToken) {
        throw new Error("access token이 없거나 올바르지 않습니다.");
    }

    return await baseClient.delete("/notification", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
