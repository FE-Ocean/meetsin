"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isTimerVisibleAtom, screenShareStateAtom, timerAtom } from "@/jotai/atom";
import Image from "next/image";
import Timer from "../timer/timer";
import useModal from "@/hooks/useModal";
import active_user_icon from "/public/active_user.svg";
import NotificationSwitch from "./notificationSwitch/notificationSwitch";
import UserInfo from "../common/userInfo/userInfo";
import LinkCopyButton from "./linkCopyButton/linkCopyButton";
import style from "./menu.module.scss";
import { IRoomUser } from "@/types/chat";
import { roomSocket } from "@/socket";
import { useEffect } from "react";
import { IScreenShareState } from "@/types/peer.type";

interface IMenu {
    className: string;
    onScreenShare: () => any;
    toggleChat: () => void;
    roomUsers: IRoomUser[];
}

const Menu = (props: IMenu) => {
    const { className, onScreenShare, toggleChat, roomUsers } = props;
    const screenShareState = useAtomValue(screenShareStateAtom);
    const [isTimerVisible, setIsTimerVisible] = useAtom(isTimerVisibleAtom);
    const { onOpen } = useModal("timerSetting");

    const handleTimerSetting = () => {
        if (isTimerVisible) return;

        onOpen();
    };

    const setTimer = useSetAtom(timerAtom);

    const handleStartTimer = (duration: { minute: number; second: number }) => {
        setTimer(duration);
        setIsTimerVisible(true);
    };

    useEffect(() => {
        roomSocket.on("start_timer", handleStartTimer);

        return () => {
            roomSocket.off("start_timer", handleStartTimer);
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
                            className={`${style.screen_share} ${screenShareState === IScreenShareState.SELF_SHARING && style.active}`}
                            onClick={onScreenShare}
                            aria-label="화면 공유하기"
                        ></button>
                    </li>
                    <li className={style.active_user_number}>
                        <Image src={active_user_icon} alt="접속자 수" />
                        <span className={style.active_circle}>●</span>
                        <span>{roomUsers.length}</span>
                    </li>
                </ul>
                <button className={style.chat} onClick={() => toggleChat()} />
            </div>
        </div>
    );
};
export default Menu;
