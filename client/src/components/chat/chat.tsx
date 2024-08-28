"use client";

import style from "./chat.module.scss";
import MessageInput from "./messageInput/messageInput";
import MessageList from "./messageList/messageList";
import ScrollToBottom from "./scrollToBottom/scrollToBottom";
import { IMessage } from "@/types/chat";

interface IChatProps {
    className: string;
    toggleChat: (shouldClose?: boolean) => void;
    messages: IMessage[];
}

const Chat = (props: IChatProps) => {
    const { className, toggleChat, messages } = props;

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
