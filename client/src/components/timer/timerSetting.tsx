import { useRef } from "react";
import { useSetAtom } from "jotai";
import { modalAtom, timerAtom, isTimerVisibleAtom } from "@/jotai/atom";
import style from "./timerSetting.module.scss";

const TimerSetting = () => {
    const minuteRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);
    const setTimer = useSetAtom(timerAtom);
    const setModal = useSetAtom(modalAtom);
    const setIsTimerVisible = useSetAtom(isTimerVisibleAtom);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setTimer({
            minute: minuteRef.current?.value || "0",
            second: minuteRef.current?.value || "0",
        });
        setModal({ open: false });
        setIsTimerVisible(true);
    };

    return (
        <form onSubmit={handleSubmit} className={style.modal_container}>
            <button className={style.close_icon} />
            <h2 className={style.title}>Timer Setting</h2>
            <div className={style.time_section}>
                <span className={style.placeholder}>88:88</span>
                <div className={style.inputs}>
                    <input ref={minuteRef} className={style.minute} type="text" maxLength={2} />
                    :
                    <input ref={secondRef} className={style.second} type="text" maxLength={2} />
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
