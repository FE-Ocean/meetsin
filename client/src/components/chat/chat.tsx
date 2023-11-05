"use client";

import Message from "./message/message";
import style from "./chat.module.scss";
import MessageInput from "./messageInput/messageInput";
import useChat from "@/hooks/useChat";
import { useEffect, useRef } from "react";

interface IChatProps {
    className: string;
    toggleChat: (shouldClose?: boolean) => void;
}

const Chat = (props: IChatProps) => {
    const { className, toggleChat } = props;

    const { messages } = useChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={`${className} ${style.chat_container}`}>
            <div className={style.chat_header}>
                <span className={style.chat_text}>Chat</span>
                <button className={style.close_button} onClick={() => toggleChat(true)} />
            </div>
            <div className={style.chat_main}>
                {messages.map((message, index) => (
                    <Message
                        key={index}
                        message={message.message}
                        nickname={message.nickname}
                        time={message.time}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className={style.chat_bottom}>
                <MessageInput />
            </div>
        </div>
    );
};

export default Chat;
