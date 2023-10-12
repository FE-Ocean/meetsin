"use client";

import { useAtom, useSetAtom } from "jotai";
import { modalAtom, isTimerVisibleAtom, timerAtom } from "@/jotai/atom";
import Image from "next/image";
import active_user_icon from "/public/active_user.svg";
import TimerSetting from "../timer/timerSetting";
import Timer from "../timer/timer";
import style from "./menu.module.scss";

interface IMenu {
    className: string;
}

const Menu = (props: IMenu) => {
    const { className } = props;
    const setModal = useSetAtom(modalAtom);
    const [isTimerVisible] = useAtom(isTimerVisibleAtom);
    const [timer] = useAtom(timerAtom);

    const handleTimer = () => {
        setModal({
            open: true,
            content: <TimerSetting />,
        });
    };

    return (
        <div className={`${className} ${style.menu_container}`}>
            {isTimerVisible && <Timer minute={timer.minute} second={timer.second} />}
            <ul className={style.menu_bar}>
                <li>
                    <button
                        onClick={handleTimer}
                        className={style.timer}
                        aria-label="타이머 설정하기"
                    ></button>
                </li>
                <li>
                    <button className={style.screen_share} aria-label="화면 공유하기"></button>
                </li>
                <li className={style.active_user_number}>
                    <Image src={active_user_icon} alt="접속자 수" />
                    <span className={style.active_circle}>●</span>
                    <span>2</span>
                </li>
            </ul>
            <button className={style.chat} />
        </div>
    );
};
export default Menu;
