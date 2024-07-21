import { userAtom } from "@/jotai/atom";
import { roomSocket } from "@/socket";
import { IRoomUser, IMessage } from "@/types/chat";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

interface Params {
    roomId: string;
}

const useChatSocket = (params: Params) => {
    const { roomId } = params;
    const user = useAtomValue(userAtom);

    const [roomUsers, setRoomUsers] = useState<IRoomUser[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);

    const handleNewMessage = (message: IMessage) => {
        setMessages((prev) => [...prev, message]);
    };

    const handleRoomUsers = (users: IRoomUser[]) => {
        setRoomUsers(users);
    };

    const handleBeforeUnload = () => {
        roomSocket.emit("leave_room", { roomId, userId: user?.userId });
        roomSocket.off("new_message");
        roomSocket.disconnect();
    };

    useEffect(() => {
        if (!user || !roomId) return;

        roomSocket.emit("join_room", { roomId, userId: user.userId, userName: user.userName });
        roomSocket.on("new_message", handleNewMessage);
        roomSocket.on("room_users", handleRoomUsers);

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            roomSocket.emit("leave_room", { roomId, userId: user.userId });
            roomSocket.off("new_message");
            roomSocket.off("room_users");
            roomSocket.disconnect();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [roomId, user]);

    return { messages, roomUsers };
};

export default useChatSocket;
