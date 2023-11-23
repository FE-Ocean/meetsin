"use client";

import style from "./chat.module.scss";
import MessageInput from "./messageInput/messageInput";
import useChat from "@/hooks/useChat";
import { useEffect, useRef } from "react";
import MyMessage from "./myMessage/myMessage";
import ReceivedMessage from "./receivedMessage/receivedMessage";

interface IChatProps {
    className: string;
    toggleChat: (shouldClose?: boolean) => void;
}

const TEST_MESSAGE_LIST = [
    {
        nickname: "현섭",
        message: "하이",
        time: "2023-11-07T12:00:00.000Z",
    },
    {
        nickname: "me",
        message: "dsfdssffsddfdsfdsfdfsdfsfdsdfsfsdfsdfdsfsdf",
        time: "2023-11-07T12:00:00.000Z",
    },
    {
        nickname: "me",
        message:
            "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
        time: "2023-11-07T12:00:00.000Z",
    },
    {
        nickname: "현섭",
        message: "ddfjsdhfisdhfsdhuifshduifhsuifhsudifhsiudfhsifhiusfhsdhfuisdfh",
        time: "2023-11-07T12:00:00.000Z",
    },
    {
        nickname: "me",
        message: "하이",
        time: "2023-11-07T12:00:00.000Z",
    },
    {
        nickname: "현섭",
        message: "하이",
        time: "2023-11-07T12:00:00.000Z",
    },
    {
        nickname: "현섭",
        message:
            "하이이현섭 하이이현섭 하이이현섭하이이현섭 하이이현섭 하이이현섭하이이현섭 하이이현섭 하이이현섭하이이현섭 하이이현섭 하이이현섭하이이현섭 하이이현섭 하이이현섭",
        time: "2023-11-07T12:00:00.000Z",
    },
    {
        nickname: "현섭",
        message:
            "하이이현섭 하이이현섭 하이이현섭하이이현섭 하이이현섭 하이이현섭하이이현섭하이이현섭 하이이현섭하이이현섭 하이이현섭 하이이현섭하이하이이현섭 하이이현섭하이이현섭 하이이현섭 하이이현섭하이 하이이현섭 하이이현섭하이이현섭 하이이현섭 하이이현섭하이이현섭 하이이현섭 하이이현섭",
        time: "2023-11-07T12:00:00.000Z",
    },
];

const Chat = (props: IChatProps) => {
    const { className, toggleChat } = props;

    // const { messages } = useChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    return (
        <div className={`${className} ${style.chat_container}`}>
            <div className={style.chat_header}>
                <span className={style.chat_text}>Chat</span>
                <button className={style.close_button} onClick={() => toggleChat(true)} />
            </div>
            <div className={style.chat_main}>
                {TEST_MESSAGE_LIST.map((message, index) => {
                    return message.nickname === "me" ? (
                        <MyMessage key={index} message={message.message} time={message.time} />
                    ) : (
                        <ReceivedMessage
                            key={index}
                            message={message.message}
                            time={message.time}
                            nickname={message.nickname}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className={style.chat_bottom}>
                <MessageInput />
            </div>
        </div>
    );
};

export default Chat;
