import { RefObject, useEffect, useRef, useState } from "react";
import { chatSocket } from "@/socket";

const useMessage = ({
    inputRef,
    payload,
}: {
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
    payload?: Object;
}) => {
    const [message, setMessage] = useState("");

    const initInputHeight = useRef<string>("");

    const initializeHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = initInputHeight.current;
        }
    };

    const adjustHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {
            target: { value },
        } = e;
        setMessage(value);
        adjustHeight();
    };

    const send = () => {
        if (!message) return;

        const messageInfo = {
            message,
            ...payload,
        };

        chatSocket.emit("new_message", messageInfo);
        setMessage("");
        initializeHeight();
    };

    useEffect(() => {
        if (inputRef.current) {
            const computedStyle = getComputedStyle(inputRef.current);
            initInputHeight.current = computedStyle.height;
        }
    }, [inputRef]);

    return { onChange, send, message };
};

export default useMessage;
