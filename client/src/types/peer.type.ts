import {DataConnection} from "peerjs";
import { IUser } from "./user.type";

export interface IPeer {
        user: IUser
        stream: MediaStream | undefined
        connection: DataConnection | undefined
        peerId: string
}