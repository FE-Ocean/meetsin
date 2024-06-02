import { userAtom } from "@/jotai/atom";
import { chatSocket } from "@/socket";
import { IMessage } from "@/types/chat";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

interface Params {
    roomId: string;
}

const useChatSocket = (params: Params) => {
    const { roomId } = params;
    const user = useAtomValue(userAtom);

    const [messages, setMessages] = useState<IMessage[]>([]);

    const handleNewMessage = (message: IMessage) => {
        setMessages((prev) => [...prev, message]);
    };

    useEffect(() => {
        if (!user || !roomId) return;

        // chatSocket.connect(); // 제가 auto를 ture로 해서 일단 주석 처리 했어요

        chatSocket.emit("join_room", { roomId, userId: user.userId });
        chatSocket.on("new_message", handleNewMessage);

        return () => {
            chatSocket.emit("leave_room", { roomId, userId: user.userId });
            chatSocket.off("new_message");
            chatSocket.disconnect();
        };
    }, [roomId, user]);

    return { messages };
};

export default useChatSocket;
