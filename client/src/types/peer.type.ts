import { IUser } from "./user.type";

export interface IPeer {
        user: IUser
        stream: MediaStream | undefined
}