import {DataConnection} from "peerjs";
import { IUser } from "./user.type";

export interface IPeer {
        user: IUser
        stream: MediaStream | undefined
        connection: DataConnection | undefined
        peerId: string
}

export const IScreenShareState = {
    SOMEONE_SHARING: "SOMEONE_SHARING",
    SELF_SHARING: "SELF_SHARING",
    NOT_SHARING: "NOT_SHARING",
} as const;
export type IScreenShareState = typeof IScreenShareState [keyof typeof IScreenShareState]
