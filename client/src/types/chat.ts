export interface IMessage {
    nickname: string;
    message: string;
    time: string;
}

export interface IRoomUser {
    socketId: string;
    userId: string;
    userName: string;
}
