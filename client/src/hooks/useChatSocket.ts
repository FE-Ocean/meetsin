import { userAtom } from "@/jotai/atom";
import { chatSocket } from "@/socket";
import { IChatUser, IMessage } from "@/types/chat";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

interface Params {
    roomId: string;
}

const useChatSocket = (params: Params) => {
    const { roomId } = params;
    const user = useAtomValue(userAtom);

    const [chatUsers, setChatUsers] = useState<IChatUser[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);

    const handleNewMessage = (message: IMessage) => {
        setMessages((prev) => [...prev, message]);
    };

    const handleRoomUsers = (users: IChatUser[]) => {
        setChatUsers(users);
    };

    const handleBeforeUnload = () => {
        chatSocket.emit("leave_room", { roomId, userId: user?.userId });
        chatSocket.off("new_message");
        chatSocket.disconnect();
    };

    useEffect(() => {
        if (!user || !roomId) return;

        // chatSocket.connect(); // 제가 auto를 ture로 해서 일단 주석 처리 했어요

        chatSocket.emit("join_room", { roomId, userId: user.userId, userName: user.userName });
        chatSocket.on("new_message", handleNewMessage);
        chatSocket.on("room_users", handleRoomUsers);

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            chatSocket.emit("leave_room", { roomId, userId: user.userId });
            chatSocket.off("new_message");
            chatSocket.off("room_users");
            chatSocket.disconnect();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [roomId, user]);

    return { messages, chatUsers };
};

export default useChatSocket;
