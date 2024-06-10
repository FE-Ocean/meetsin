"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isTimerVisibleAtom, screenShareAtom, timerAtom } from "@/jotai/atom";
import Image from "next/image";
import Timer from "../timer/timer";
import useModal from "@/hooks/useModal";
import active_user_icon from "/public/active_user.svg";
import NotificationSwitch from "./notificationSwitch/notificationSwitch";
import UserInfo from "../common/userInfo/userInfo";
import LinkCopyButton from "./linkCopyButton/linkCopyButton";
import style from "./menu.module.scss";
import { chatSocket } from "@/socket";
import { useEffect } from "react";

interface IMenu {
    className: string;
    onScreenShare: () => any;
    toggleChat: () => void;
}

const Menu = (props: IMenu) => {
    const { className, onScreenShare, toggleChat } = props;
    const isScreenShare = useAtomValue(screenShareAtom);
    const [isTimerVisible, setIsTimerVisible] = useAtom(isTimerVisibleAtom);
    const { onOpen } = useModal("timerSetting");

    const handleTimerSetting = () => {
        if (isTimerVisible) return;

        onOpen();
    };

    const setTimer = useSetAtom(timerAtom);

    const handleStartTimer = (duration: any) => {
        setTimer(duration);
        setIsTimerVisible(true);
    };

    useEffect(() => {
        chatSocket.on("start_timer", handleStartTimer);

        return () => {
            chatSocket.off("start_timer", handleStartTimer);
        };
    }, []);

    return (
        <div className={`${className} ${style.menu_container}`}>
            <UserInfo />
            <NotificationSwitch />
            <LinkCopyButton className={style.link_copy_button} />

            <div className={style.right_container}>
                {isTimerVisible && <Timer setIsTimerVisible={setIsTimerVisible} />}
                <ul className={style.menu_bar}>
                    <li>
                        <button
                            onClick={handleTimerSetting}
                            className={style.timer}
                            aria-label="타이머 설정하기"
                        ></button>
                    </li>
                    <li>
                        <button
                            className={`${style.screen_share} ${isScreenShare && style.active}`}
                            onClick={onScreenShare}
                            aria-label="화면 공유하기"
                        ></button>
                    </li>
                    <li className={style.active_user_number}>
                        <Image src={active_user_icon} alt="접속자 수" />
                        <span className={style.active_circle}>●</span>
                        <span>2</span>
                    </li>
                </ul>
                <button className={style.chat} onClick={() => toggleChat()} />
            </div>
        </div>
    );
};
export default Menu;
