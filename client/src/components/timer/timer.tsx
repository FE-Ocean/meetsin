import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAtom } from "jotai";
import { timerAtom } from "@/jotai/atom";
import { numberToString } from "@/utils";
import { postNotification } from "../menu/notificationSwitch/notification";
import { chatSocket } from "@/socket";
import timer_icon from "/public/timer.svg";
import style from "./timer.module.scss";

interface ITimer {
    setIsTimerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SECONDS_PER_MINUTE = 60;

const Timer = ({ setIsTimerVisible }: ITimer) => {
    const { roomId } = useParams();
    const [{ minute, second }] = useAtom(timerAtom);

    const totalSec = useRef(minute * SECONDS_PER_MINUTE + second);
    const interval = useRef<NodeJS.Timeout | null>(null);
    const [min, setMin] = useState(minute);
    const [sec, setSec] = useState(second);

    const playSoundEffect = useCallback(() => {
        const alarm = new Audio("/timer_alarm.mp3");

        alarm.play();
        alarm.onended = () => {
            setIsTimerVisible(false);
        };
    }, [setIsTimerVisible]);

    useEffect(() => {
        interval.current = setInterval(() => {
            totalSec.current -= 1;

            setMin(Math.trunc(totalSec.current / SECONDS_PER_MINUTE));
            setSec(totalSec.current % SECONDS_PER_MINUTE);
        }, 1000);
    }, []);

    useEffect(() => {
        if (totalSec.current === 0) {
            clearInterval(interval.current!);

            playSoundEffect();
            // postNotification();
        }
    }, [sec, playSoundEffect]);

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
