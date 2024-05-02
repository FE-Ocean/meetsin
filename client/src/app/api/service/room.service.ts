import { useQuery } from "@tanstack/react-query";
import { getRoomInfo, getUserRooms, postRoom } from "../repository/room.repository";
import { IRoomModel } from "@/types/room";
import { QUERY_KEY } from "@/constants/queryKey.const";

// export const fetchgetRoomInfo = async (roomId: string, accessToken: string) => {
//     const response = await getRoomInfo(roomId, accessToken);
// };

export const usePostRoom = async (roomNameInput: string, accessToken: string) => {
    const res = await postRoom(roomNameInput, accessToken);
    return {
        roomId: res._id,
        roomName: res.room_name,
        admin: res.admin,
    };
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

    return useQuery({ queryKey: [...QUERY_KEY.room], queryFn: formatRoomsData });
};
