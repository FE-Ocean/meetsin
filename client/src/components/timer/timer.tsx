"use client";

import { useEffect, useRef, useState } from "react";
import style from "./timer.module.scss";

interface ITimer {
    minute: string;
    second: string;
}

const numberToString = (num: number) => {
    return String(num).padStart(2, "0");
};

const Timer = (time: ITimer) => {
    const min = parseInt(time.minute);
    const sec = parseInt(time.second);

    const count = useRef(min * 60 + sec);
    const interval = useRef(null);

    const [minute, setMinute] = useState(numberToString(min));
    const [second, setSecond] = useState(numberToString(sec));

    useEffect(() => {
        interval.current = setInterval(() => {
            count.current -= 1;

            setMinute(numberToString(parseInt((count.current % 3600) / 60)));
            setSecond(numberToString(count.current % 60));
        }, 1000);
    }, []);

    useEffect(() => {
        if (count.current <= 0) {
            clearInterval(interval.current);
        }
    }, [second]);

    return (
        <div className={style.container} aria-label="남은 시간">
            <img src="/timer.svg" alt="" />
            <div className={style.time_container}>
                <span>{minute}</span>:<span>{second}</span>
            </div>
        </div>
    );
};
export default Timer;
