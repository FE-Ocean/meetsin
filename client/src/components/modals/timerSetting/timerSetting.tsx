import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { timerAtom, isTimerVisibleAtom } from "@/jotai/atom";
import { BaseModal } from "@/components/modal/baseModal/baseModal";
import style from "./timerSetting.module.scss";

const numberToString = (num: number) => {
    return String(num).padStart(2, "0");
};

interface IModal {
    onClose: () => void;
}

const TimerSetting = ({ onClose }: IModal) => {
    const setTimer = useSetAtom(timerAtom);
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
            minute: Number(minRef.current.value) || 0,
            second: Number(secRef.current.value) || 0,
        });
        onClose();
        setIsTimerVisible(true);
    };

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        ref: React.RefObject<HTMLInputElement>,
    ) => {
        ref.current!.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);

        if (Number(secRef.current.value) > 59) {
            secRef.current.value = numberToString(Number(secRef.current.value) - 60);
            minRef.current.value = numberToString(Number(minRef.current.value) + 1);
        }
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement>,
        ref: React.RefObject<HTMLInputElement>,
    ) => {
        ref.current!.value = e.target.value.padStart(2, "0");
    };

    return (
        <BaseModal onClose={onClose}>
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
                            onChange={(e) => handleInput(e, minRef)}
                            onBlur={(e) => handleBlur(e, minRef)}
                        />
                        :
                        <input
                            type="text"
                            maxLength={2}
                            className={style.second}
                            ref={secRef}
                            onChange={(e) => handleInput(e, secRef)}
                            onBlur={(e) => handleBlur(e, secRef)}
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
        </BaseModal>
    );
};
export default TimerSetting;
