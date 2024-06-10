import { useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { postNotification } from "../menu/notificationSwitch/notification";
import { chatSocket } from "@/socket";
import useTimer from "../../hooks/useTimer";
import { numberToString } from "@/utils";
import timer_icon from "/public/timer.svg";
import style from "./timer.module.scss";

interface ITimer {
    setIsTimerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Timer = ({ setIsTimerVisible }: ITimer) => {
    const { roomId } = useParams();

    const playSoundEffect = useCallback(() => {
        const alarm = new Audio("/timer_alarm.mp3");

        alarm.play();
        alarm.onended = () => {
            setIsTimerVisible(false);
        };
    }, [setIsTimerVisible]);

    const handleTimerEnd = () => {
        playSoundEffect();
        // postNotification();
        console.log("이권한 노티랑 푸시가 통합됐다고함", Notification.permission);
        // new Notification("시간 끝");
    };

    const { min, sec } = useTimer({ timerEnd: handleTimerEnd });

    const handleClickStop = () => {
        chatSocket.emit("stop_timer", roomId);
    };

    const handleStopTimer = () => {
        setIsTimerVisible(false);
    };

    useEffect(() => {
        chatSocket.on("stop_timer", handleStopTimer);

        return () => {
            chatSocket.off("stop_timer");
        };
    }, [chatSocket]);

    return (
        <div className={style.container} aria-label="남은 시간">
            <Image src={timer_icon} alt="" />
            <button className={style.stop_button} onClick={handleClickStop} />
            <div className={style.time_container}>
                <span>{numberToString(min)}</span>:<span>{numberToString(sec)}</span>
            </div>
        </div>
    );
};
export default Timer;
