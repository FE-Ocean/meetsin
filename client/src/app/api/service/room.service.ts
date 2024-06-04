import { useMutation, useQuery } from "@tanstack/react-query";
import {
    deleteRoom,
    getRoomInfo,
    getUserRooms,
    patchRoom,
    createRoom,
} from "../repository/room.repository";
import { IPatchRoom, IRoomModel } from "@/types/room";
import { QUERY_KEY } from "@/constants/queryKey.const";
import { queryClient } from "@/query/queryProvider";

interface ICreateRoom {
    roomNameInput: string;
    accessToken: string;
}

export const useCreateRoom = () => {
    const formatRoomData = async ({ roomNameInput, accessToken }: ICreateRoom) => {
        const res = await createRoom(roomNameInput, accessToken);
        return {
            roomId: res._id,
            roomName: res.room_name,
            admin: res.admin,
        };
    };

    return useMutation({ mutationFn: formatRoomData });
};

export const useGetRoomData = (roomId: string, accessToken: string) => {
    const formatRoomData = async () => {
        const res = (await getRoomInfo(roomId, accessToken)) as IRoomModel;
        return {
            id: res._id,
            roomName: res.room_name,
            admin: res.admin,
            createdAt: res.created_at,
        };
    };

    return useQuery({ queryKey: QUERY_KEY.room(roomId), queryFn: formatRoomData });
};

export const usePatchRoomData = () => {
    const formatRoomData = async ({ roomName, roomId, accessToken }: IPatchRoom) => {
        const res = (await patchRoom({ roomName, roomId, accessToken })) as IRoomModel;
        return {
            id: res._id,
            roomName: res.room_name,
            admin: res.admin,
            createdAt: res.created_at,
        };
    };

    return useMutation({
        mutationFn: formatRoomData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.rooms });
        },
    });
};

export const useGetUserRooms = (accessToken: string) => {
    const formatRoomsData = async () => {
        const res = (await getUserRooms(accessToken)) as IRoomModel[];
        return res.map((room) => ({
            id: room._id,
            roomName: room.room_name,
            admin: room.admin,
            createdAt: room.created_at,
        }));
    };

    return useQuery({ queryKey: QUERY_KEY.rooms, queryFn: formatRoomsData });
};

export const useDeleteRoom = (roomId: string, accessToken: string) => {
    return useMutation({
        mutationFn: () => deleteRoom(roomId, accessToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.rooms });
        },
    });
};
