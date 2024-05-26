import { baseClient } from "@/modules/fetchClient";
import { IPatchRoom } from "@/types/room";

export const getRoomInfo = async (roomId: string, accessToken: string) => {
    if (!accessToken) {
        throw new Error("access token이 없거나 올바르지 않습니다."); //이거 어디서
    }

    return await baseClient.get(`/rooms/${roomId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const getUserRooms = async (accessToken: string) => {
    if (!accessToken) {
        throw new Error("access token이 없거나 올바르지 않습니다.");
    }

    return await baseClient.get("/rooms/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const createRoom = async (roomNameInput: string, accessToken: string) => {
    try {
        if (!accessToken) {
            throw new Error("access token이 없거나 올바르지 않습니다.");
        }

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

export const patchRoom = async ({ roomName, roomId, accessToken }: IPatchRoom) => {
    try {
        if (!accessToken) {
            throw new Error("access token이 없거나 올바르지 않습니다.");
        }

        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${roomId}`;
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ roomData: { roomName } }),
        });

        if (!response.ok) {
            throw new Error(`PATCH room 실패: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteRoom = async (roomId: string, accessToken: string) => {
    if (!accessToken) {
        throw new Error("access token이 없거나 올바르지 않습니다.");
    }

    return await baseClient.delete(`/rooms/${roomId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
