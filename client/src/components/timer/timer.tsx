"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import timer_icon from "/public/timer.svg";
import { useAtom } from "jotai";
import { timerAtom } from "@/jotai/atom";
import style from "./timer.module.scss";

const numberToString = (num: number) => {
    return String(num).padStart(2, "0");
};

const Timer = () => {
    const [{ minute, second }] = useAtom(timerAtom);
    const count = useRef(minute * 60 + second);
    const interval = useRef<NodeJS.Timeout | null>(null);
    const [min, setMin] = useState(numberToString(minute));
    const [sec, setSec] = useState(numberToString(second));

    useEffect(() => {
        interval.current = setInterval(() => {
            count.current -= 1;

            setMin(numberToString(Math.trunc(count.current / 60)));
            setSec(numberToString(count.current % 60));
        }, 1000);
    }, []);

    useEffect(() => {
        if (count.current <= 0) {
            clearInterval(interval.current!);
            //여기서? 또 setTimout으로..몇 초 뒤에
        }
    }, [sec]);

    return (
        <div className={style.container} aria-label="남은 시간">
            <Image src={timer_icon} alt="" />
            <div className={style.time_container}>
                <span>{min}</span>:<span>{sec}</span>
            </div>
        </div>
    );
};
export default Timer;
