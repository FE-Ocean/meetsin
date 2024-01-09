"use client";

import { useRef, useState } from "react";
import style from "./messageInput.module.scss";
import useMessage from "@/hooks/useMessage";
import { useSearchParams } from "next/navigation";
import useAdjustHeight from "@/hooks/useAdjustHeight";
import useResetHeight from "@/hooks/useResetHeight";

const MessageInput = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [isComposing, setIsComposing] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const userName = searchParams.get("username");

    const { message, onChange, sendMessage } = useMessage({
        inputRef: textareaRef,
        payload: { nickname: userName },
    });

    const adjustHeight = useAdjustHeight({ inputRef: textareaRef });
    const resetHeight = useResetHeight({ inputRef: textareaRef });

    const submitMessage = () => {
        sendMessage();
        resetHeight();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isComposing) return;
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            submitMessage();
            return;
        }
    };

    return (
        <form className={`${style.input_container}`} onSubmit={handleSubmit}>
            <textarea
                className={style.message_textarea}
                placeholder="메세지를 입력하세요."
                rows={1}
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                    onChange(e);
                    adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
            />
            <button type="submit" className={`${style.send_button} ${!!message && style.active}`} />
        </form>
    );
};

export default MessageInput;
