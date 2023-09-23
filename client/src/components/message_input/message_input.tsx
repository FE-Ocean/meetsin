"use client";

import { useState } from "react";
import style from "./message_input.module.scss";

const MessageInput = () => {

    const [isFocused, setIsFocused] = useState(false);
    const [message, setMessage] = useState("");

    const buttonActive = !!message;

    const handleChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const { target : { value } } = e;
        setMessage(value);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className={`${style.input_container} ${isFocused && style.focus}`}>
            <textarea 
                className={style.message_textarea} 
                placeholder="메세지를 입력하세요."
                value={message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <button className={`${style.send_button} ${buttonActive && style.active}`} />
        </div>
    )
};

export default MessageInput;