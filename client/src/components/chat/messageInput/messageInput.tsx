"use client";

import { useEffect, useRef, useState } from "react";
import style from "./messageInput.module.scss";
import useMessage from "@/hooks/useMessage";

const MessageInput = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [isComposing, setIsComposing] = useState<boolean>(false);
    const [user_name, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const name = localStorage.getItem("user_name");
        setUserName(name);
    }, []);

    const { message, onChange, send } = useMessage({
        inputRef: textareaRef,
        payload: { nickname: user_name },
    });

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isComposing) return;

        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            send();
            return;
        }
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompoistionEnd = () => {
        setIsComposing(false);
    };

    return (
        <div className={`${style.input_container} ${isFocused && style.focus}`}>
            <textarea
                className={style.message_textarea}
                placeholder="메세지를 입력하세요."
                rows={1}
                ref={textareaRef}
                value={message}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompoistionEnd}
            />
            <button
                type="button"
                className={`${style.send_button} ${!!message && style.active}`}
                onClick={send}
            />
        </div>
    );
};

export default MessageInput;
