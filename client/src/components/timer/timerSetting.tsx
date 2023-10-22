import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { modalAtom, timerAtom, isTimerVisibleAtom } from "@/jotai/atom";
import style from "./timerSetting.module.scss";

const numberToString = (num: number) => {
    return String(num).padStart(2, "0");
};

const TimerSetting = () => {
    const setTimer = useSetAtom(timerAtom);
    const setModal = useSetAtom(modalAtom);
    const setIsTimerVisible = useSetAtom(isTimerVisibleAtom);
    const minRef = useRef<HTMLInputElement>({} as HTMLInputElement);
    const secRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    useEffect(() => {
        minRef.current.value = "25";
        secRef.current.value = "00";
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (minRef.current.value === "00" && secRef.current.value === "00") return;

        setTimer({
            minute: parseInt(minRef.current.value) || 0,
            second: parseInt(secRef.current.value) || 0,
        });
        setModal({ open: false });
        setIsTimerVisible(true);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);

        if (parseInt(secRef.current.value) > 59) {
            secRef.current.value = numberToString(Number(secRef.current.value) - 60);
            minRef.current.value = numberToString(Number(minRef.current.value) + 1);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.padStart(2, "0");
    };

    return (
        <form onSubmit={handleSubmit} className={style.modal_container}>
            <button type="button" className={style.close_icon} />
            <h2 className={style.title}>Timer Setting</h2>
            <div className={style.time_section}>
                <span className={style.placeholder}>88:88</span>
                <div className={style.inputs}>
                    <input
                        type="text"
                        maxLength={2}
                        className={style.minute}
                        ref={minRef}
                        onChange={handleInput}
                        onBlur={handleBlur}
                    />
                    :
                    <input
                        type="text"
                        maxLength={2}
                        className={style.second}
                        ref={secRef}
                        onChange={handleInput}
                        onBlur={handleBlur}
                    />
                </div>
            </div>
            <div className={style.buttons}>
                <button type="button" className={style.close}>
                    CLOSE
                </button>
                <button type="submit" className={style.start}>
                    START
                </button>
            </div>
        </form>
    );
};
export default TimerSetting;
