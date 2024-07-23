import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { timerAtom } from "@/jotai/atom";

const SECONDS_PER_MINUTE = 60;

const useTimer = ({ timerEnd }: { timerEnd: () => void }) => {
    const [{ minute, second }] = useAtom(timerAtom);

    const totalSec = useRef(minute * SECONDS_PER_MINUTE + second);
    const interval = useRef<NodeJS.Timeout | null>(null);
    const [min, setMin] = useState(minute);
    const [sec, setSec] = useState(second);

    useEffect(() => {
        interval.current = setInterval(() => {
            totalSec.current -= 1;

            setMin(Math.trunc(totalSec.current / SECONDS_PER_MINUTE));
            setSec(totalSec.current % SECONDS_PER_MINUTE);
        }, 1000);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        };
    }, []);

    useEffect(() => {
        if (totalSec.current === 0) {
            clearInterval(interval.current!);
            timerEnd();
        }
    }, [totalSec, timerEnd]);

    return { min, sec };
};
export default useTimer;
