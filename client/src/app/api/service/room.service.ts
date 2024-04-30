import { getRoomInfo, getUserRooms, postRoom } from "../repository/room.repository";

// export const fetchgetRoomInfo = async (roomId: string, accessToken: string) => {
//     const response = await getRoomInfo(roomId, accessToken);
// };

export const usePostRoom = async (roomNameInput: string, accessToken: string) => {
    const response = await postRoom(roomNameInput, accessToken);
    return {
        roomId: response._id,
        roomName: response.room_name,
        admin: response.admin,
    };
};

export const useGetUserRooms = async (accessToken: string) => {
    const response = await getUserRooms(accessToken);
    return response;
};
