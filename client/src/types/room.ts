import { IUser, IUserModel } from "./user.type";

export interface IRoom {
    id: string;
    roomName: string;
    admin: string;
    createdAt: string;
    userIds: IUserModel[];
}

export interface IRoomModel {
    _id: string;
    room_name: string;
    admin: string;
    created_at: string;
    userIds: IUserModel[];
}

export interface IPatchRoom {
    roomName: string;
    roomId: string;
}

export interface ICreateRoomResponse {
    room_name: string;
    admin: string;
    userIds: string[];
    _id: string;
    created_at: string;
}
