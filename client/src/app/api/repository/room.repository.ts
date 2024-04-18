import { baseClient } from "@/modules/fetchClient";

export const getRoomInfo = async (roomId: string, accessToken: string) => {
    if (!accessToken) {
        throw new Error("access token이 없거나 올바르지 않습니다.");
    }
    return await baseClient.get(`/rooms/${roomId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const postRoom = async (roomNameInput: string, accessToken: string) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ roomData: { roomName: roomNameInput } }),
        });

        if (!response.ok) {
            throw new Error(`post room 실패: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
