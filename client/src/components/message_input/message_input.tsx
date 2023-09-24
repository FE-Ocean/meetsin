"use client";

import { useRef, useState } from "react";
import style from "./message_input.module.scss";
import { socket } from "../../socket";

const MessageInput = () => {

    const [isFocused, setIsFocused] = useState(false);
    const [message, setMessage] = useState("");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const buttonActive = !!message;

    const initializeHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "21px";
        }
    };

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const getCurrentTime = () => {
        const now = new Date();
        let hours: string | number = now.getHours();
        let minutes: string | number = now.getMinutes();

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        return `${hours}:${minutes}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { target: { value } } = e;
        setMessage(value);
        adjustHeight();
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleSend = () => {

        if (!message) return;

        const messageInfo = {
            message,
            nickname: "닉네임",
            time: getCurrentTime()
        };

        socket.emit("new_message", messageInfo);
        setMessage("");
        initializeHeight();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            handleSend();
            return;
        };

    };

    return (
        <div className={`${style.input_container} ${isFocused && style.focus}`}>
            <textarea
                className={style.message_textarea}
                placeholder="메세지를 입력하세요."
                rows={1}
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
            />
            <button
                type="button"
                className={`${style.send_button} ${buttonActive && style.active}`}
                onClick={handleSend}
            />
        </div>
    );
};

export default MessageInput;