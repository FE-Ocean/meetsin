import { useEffect, useState } from "react";
import { useGetUserInfo } from "@/apis/service/user.service";
import { roomSocket } from "@/socket";
import { IRoomUser, IMessage } from "@/types/chat.type";

interface Params {
    roomId: string;
}

const useChatSocket = (params: Params) => {
    const { roomId } = params;
    const { data: user } = useGetUserInfo();

    const [roomUsers, setRoomUsers] = useState<IRoomUser[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);

    const handleNewMessage = (message: IMessage) => {
        setMessages((prev) => [...prev, message]);
    };

    const handleRoomUsers = (users: IRoomUser[]) => {
        setRoomUsers(users);
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            roomSocket.emit("leave_room", { roomId, userId: user?.userId });
            roomSocket.off("new_message");
            roomSocket.disconnect();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [roomId, user]);

    useEffect(() => {
        if (!user || !roomId) return;

        if (!roomSocket.connected) {
            roomSocket.connect();
        }

        roomSocket.emit("join_room", { roomId, userId: user.userId, userName: user.userName });
        roomSocket.on("new_message", handleNewMessage);
        roomSocket.on("room_users", handleRoomUsers);

        return () => {
            roomSocket.emit("leave_room", { roomId, userId: user.userId });
            roomSocket.off("new_message");
            roomSocket.off("room_users");
            roomSocket.disconnect();
        };
    }, [roomId, user]);

    return { messages, roomUsers };
};

export default useChatSocket;
