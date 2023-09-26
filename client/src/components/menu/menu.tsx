"use client";

import { useSetAtom } from "jotai";
import { modalAtom } from "@/jotai/atom";
import TimerSetting from "../timer/timerSetting";
import style from "./menu.module.scss";

interface IMenu {
    className: string;
}

const Menu = (props: IMenu) => {
    const { className } = props;
    const setModal = useSetAtom(modalAtom);

    const handleTimer = () => {
        console.log("e돌림");
        setModal({
            open: true,
            content: <TimerSetting />,
        });
    };

    return (
        <div className={`${className} ${style.menu_container}`}>
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
                    <img src="/active_user.svg" alt="접속자 수" />
                    <span className={style.active_circle}>●</span>
                    <span>2</span>
                </li>
            </ul>
            <button className={style.chat} />
        </div>
    );
};
export default Menu;
