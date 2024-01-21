import { RefObject, useState } from "react";
import { chatSocket } from "@/socket";
import { useParams } from "next/navigation";

const useMessage = ({
    payload,
}: {
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
    payload?: Object;
}) => {
    const params = useParams();
    const roomId = params.roomId as string;

    const [message, setMessage] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {
            target: { value },
        } = e;
        setMessage(value);
    };

    const sendMessage = () => {
        if (!message) return;

        const messageInfo = {
            roomId,
            message,
            ...payload,
        };

        chatSocket.emit("new_message", messageInfo);
        setMessage("");
    };

    return { onChange, sendMessage, message };
};

export default useMessage;
