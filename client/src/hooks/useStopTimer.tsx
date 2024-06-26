import { useEffect } from "react";
import { useParams } from "next/navigation";
import { chatSocket } from "@/socket";

const useStopTimer = (onStop: () => void) => {
    const { roomId } = useParams();

    const handleEmitStopTimer = () => {
        chatSocket.emit("stop_timer", roomId);
    };

    useEffect(() => {
        chatSocket.on("stop_timer", onStop);

        return () => {
            chatSocket.off("stop_timer", onStop);
        };
    }, [onStop]);

    return handleEmitStopTimer;
};
export default useStopTimer;
