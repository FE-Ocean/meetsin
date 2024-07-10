import { useCallback, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "@/jotai/atom";
import useTimer from "./hooks/useTimer";
import useStopTimer from "./hooks/useStopTimer";
import { createPushNotification } from "@/app/api/repository/notification.repository";
import { numberToString } from "@/utils";
import timer_icon from "/public/timer.svg";
import style from "./timer.module.scss";

interface ITimer {
    setIsTimerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Timer = ({ setIsTimerVisible }: ITimer) => {
    const accessToken = useAtomValue(accessTokenAtom);
    const param = useParams();
    const roomId = param.roomId as string;

    const [confirmStop, setConfirmStop] = useState(false);

    const playSoundEffect = useCallback(() => {
        const alarm = new Audio("/timer_alarm.mp3");

        alarm.play();
        alarm.onended = () => {
            setIsTimerVisible(false);
        };
    }, [setIsTimerVisible]);

    const handleTimerEnd = () => {
        playSoundEffect();
        createPushNotification(roomId, accessToken);
        // 이권한 노티랑 푸시가 통합됐다고함", Notification.permission
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
