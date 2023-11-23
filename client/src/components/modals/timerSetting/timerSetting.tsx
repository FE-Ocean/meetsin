import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { timerAtom, isTimerVisibleAtom } from "@/jotai/atom";
import { BaseModal } from "@/components/modal/baseModal/baseModal";
import { numberToString } from "@/utils";
import Button from "@/components/common/button/button";
import style from "./timerSetting.module.scss";

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
        targetRef: React.RefObject<HTMLInputElement>,
    ) => {
        targetRef.current!.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);

        if (Number(secRef.current.value) > 59) {
            secRef.current.value = numberToString(+secRef.current.value - 60);
            minRef.current.value = numberToString(+minRef.current.value + 1);
        }
    };

    const handleBlurInput = (
        e: React.FocusEvent<HTMLInputElement>,
        targetRef: React.RefObject<HTMLInputElement>,
    ) => {
        targetRef.current!.value = e.target.value.padStart(2, "0");
    };

    return (
        <BaseModal onClose={onClose}>
            <form onSubmit={handleSubmit} className={style.modal_container}>
                <button type="button" onClick={onClose} className={style.close_icon} />
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
                            onBlur={(e) => handleBlurInput(e, minRef)}
                        />
                        :
                        <input
                            type="text"
                            maxLength={2}
                            className={style.second}
                            ref={secRef}
                            onChange={(e) => handleInput(e, secRef)}
                            onBlur={(e) => handleBlurInput(e, secRef)}
                        />
                    </div>
                </div>
                <div className={style.buttons}>
                    <Button type="button" onClick={onClose} look="ghost" width={90} text="CLOSE" />
                    <Button type="submit" look="solid" width={90} text="START" />
                </div>
            </form>
        </BaseModal>
    );
};
export default TimerSetting;
