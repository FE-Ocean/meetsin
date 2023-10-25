"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { timerAtom } from "@/jotai/atom";
import timer_icon from "/public/timer.svg";
import style from "./timer.module.scss";

const numberToString = (num: number) => {
    return String(num).padStart(2, "0");
};

interface ITimer {
    setIsTimerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Timer = ({ setIsTimerVisible }: ITimer) => {
    const [{ minute, second }] = useAtom(timerAtom);

    const count = useRef(minute * 60 + second);
    const interval = useRef<NodeJS.Timeout | null>(null);
    const [min, setMin] = useState(minute);
    const [sec, setSec] = useState(second);

    const playSoundEffect = useCallback(() => {
        const alarm = new Audio("/timer_alarm.wav");

        alarm.play();
        alarm.onended = () => {
            setIsTimerVisible(false);
        };
    }, [setIsTimerVisible]);

    useEffect(() => {
        interval.current = setInterval(() => {
            count.current -= 1;

            setMin(Math.trunc(count.current / 60));
            setSec(count.current % 60);
        }, 1000);
    }, []);

    useEffect(() => {
        if (count.current === 0) {
            clearInterval(interval.current!);

            playSoundEffect();
        }
    }, [sec, playSoundEffect]);

    return (
        <div className={style.container} aria-label="남은 시간">
            <Image src={timer_icon} alt="" />
            <div className={style.time_container}>
                <span>{numberToString(min)}</span>:<span>{numberToString(sec)}</span>
            </div>
        </div>
    );
};
export default Timer;
