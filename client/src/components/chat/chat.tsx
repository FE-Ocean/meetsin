"use client";

import style from "./chat.module.scss";
import MessageInput from "./messageInput/messageInput";
import useChatSocket from "@/hooks/useChatSocket";
import { useParams } from "next/navigation";
import MessageList from "./messageList/messageList";
import ScrollToBottom from "./scrollToBottom/scrollToBottom";

interface IChatProps {
    className: string;
    toggleChat: (shouldClose?: boolean) => void;
}

const Chat = (props: IChatProps) => {
    const { className, toggleChat } = props;

    const params = useParams();
    const roomId = params.roomId as string;

    const { messages } = useChatSocket({ roomId });

    return (
        <div className={`${className} ${style.chat_container}`}>
            <div className={style.chat_header}>
                <span className={style.chat_text}>Chat</span>
                <button className={style.close_button} onClick={() => toggleChat(true)} />
            </div>
            <div className={style.chat_main}>
                <ScrollToBottom>
                    <MessageList messages={messages} />
                </ScrollToBottom>
            </div>
            <div className={style.chat_bottom}>
                <MessageInput />
            </div>
        </div>
    );
};

export default Chat;
