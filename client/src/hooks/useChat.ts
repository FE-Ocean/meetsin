import { chatSocket } from "@/socket";
import { useEffect, useState } from "react";

interface IMessage {
    nickname: string;
    message: string;
    time: string;
}

const useChat = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const handleNewMessage = (message: IMessage) => {
            setMessages((prev) => [...prev, message]);
        };

        chatSocket.io.opts.query = {
            ...chatSocket.io.opts.query,
            token,
        };

        chatSocket.connect();
        chatSocket.on("new_message", handleNewMessage);

        return () => {
            chatSocket.disconnect();
            chatSocket.off("new_message", handleNewMessage);
        };
    }, []);

    return { messages };
};

export default useChat;
