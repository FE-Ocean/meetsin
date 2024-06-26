export interface IMessage {
    nickname: string;
    message: string;
    time: string;
}

export interface IChatUser {
    socketId: string;
    userId: string;
    userName: string;
}
