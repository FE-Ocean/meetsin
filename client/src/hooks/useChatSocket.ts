import { chatSocket } from "@/socket";
import { IMessage } from "@/types/chat";
import { useEffect, useState } from "react";

interface Params {
    roomId: string;
}

const useChatSocket = (params: Params) => {
    const { roomId } = params;

    const [messages, setMessages] = useState<IMessage[]>([]);

    const handleNewMessage = (message: IMessage) => {
        setMessages((prev) => [...prev, message]);
    };

    useEffect(() => {
        if (!roomId) return;

        chatSocket.emit("join_room", roomId);
        chatSocket.on("new_message", handleNewMessage);

        return () => {
            chatSocket.off("new_message");
            chatSocket.disconnect();
        };
    }, [roomId]);

    return { messages };
};

export default useChatSocket;
