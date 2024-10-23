import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import useTimer from "./hooks/useTimer";
import useStopTimer from "./hooks/useStopTimer";
import { useCreatePushNotification } from "@/apis/service/notification.service";
import { numberToString } from "@/utils";
import timer_icon from "/public/timer.svg";
import style from "./timer.module.scss";

interface ITimer {
    setIsTimerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Timer = ({ setIsTimerVisible }: ITimer) => {
    const param = useParams();
    const roomId = param.roomId as string;
    const [confirmStop, setConfirmStop] = useState(false);
    const hasCalledMutate = useRef(false);

    const playSoundEffect = useCallback(() => {
        const alarm = new Audio("/timer_alarm.mp3");

        alarm.play();
        alarm.onended = () => {
            setIsTimerVisible(false);
        };
    }, [setIsTimerVisible]);

    const { mutate } = useCreatePushNotification();
    const handleTimerEnd = () => {
        if (!hasCalledMutate.current) {
            hasCalledMutate.current = true;
            playSoundEffect();
            mutate({ roomId });
        }
    };

    const { min, sec } = useTimer({ timerEnd: handleTimerEnd });

    const makeTimerInvisible = () => {
        setIsTimerVisible(false);
    };

    const handleEmitStopTimer = useStopTimer(makeTimerInvisible);

    return (
        <div className={style.container} aria-label="남은 시간">
            {!confirmStop && (
                <>
                    <Image src={timer_icon} alt="" />
                    <button
                        className={style.pre_stop_button}
                        onClick={() => setConfirmStop(true)}
                    />
                    <div className={style.time_container}>
                        <span>{numberToString(min)}</span>:<span>{numberToString(sec)}</span>
                    </div>
                </>
            )}

            {confirmStop && (
                <>
                    <button className={style.back_button} onClick={() => setConfirmStop(false)} />
                    <p className={style.stop_confirmation}>모두의 타이머를 종료할까요?</p>
                    <button className={style.stop_button} onClick={handleEmitStopTimer} />
                </>
            )}
        </div>
    );
};
export default Timer;
