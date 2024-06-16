export interface IRoom {
    id: string;
    roomName: string;
    admin: string;
    createdAt: string;
    userIds: string[];
}

export interface IRoomModel {
    _id: string;
    room_name: string;
    admin: string;
    created_at: string;
    userIds: string[];
}

export interface IPatchRoom {
    roomName: string;
    roomId: string;
    accessToken: string;
}
