import { useEffect } from "react";
import { useParams } from "next/navigation";
import { roomSocket } from "@/socket";

const useStopTimer = (onStop: () => void) => {
    const { roomId } = useParams();

    const handleEmitStopTimer = () => {
        roomSocket.emit("stop_timer", roomId);
    };

    useEffect(() => {
        roomSocket.on("stop_timer", onStop);

        return () => {
            roomSocket.off("stop_timer", onStop);
        };
    }, [onStop]);

    return handleEmitStopTimer;
};
export default useStopTimer;
