import { useCallback } from "react";
import Image from "next/image";
import { postNotification } from "../menu/notificationSwitch/notification";
import useTimer from "../../hooks/useTimer";
import { numberToString } from "@/utils";
import timer_icon from "/public/timer.svg";
import style from "./timer.module.scss";
import useStopTimer from "@/hooks/useStopTimer";

interface ITimer {
    setIsTimerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Timer = ({ setIsTimerVisible }: ITimer) => {
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

    const makeTimerInvisible = () => {
        setIsTimerVisible(false);
    };

    const handleEmitStopTimer = useStopTimer(makeTimerInvisible);

    return (
        <div className={style.container} aria-label="남은 시간">
            <Image src={timer_icon} alt="" />
            <button className={style.stop_button} onClick={handleEmitStopTimer} />
            <div className={style.time_container}>
                <span>{numberToString(min)}</span>:<span>{numberToString(sec)}</span>
            </div>
        </div>
    );
};
export default Timer;
