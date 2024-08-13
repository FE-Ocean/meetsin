"use client";

import UserInfo from "@/components/common/userInfo/userInfo";
import style from "./lobbyHeader.module.scss";
import useModal from "@/hooks/useModal";

const LobbyHeader = () => {
    const { onOpen } = useModal("createRoom");

    return (
        <header className={style.header}>
            <UserInfo direction="bottom" />
            <button className={style.create_room} type="button" onClick={onOpen}>
                방 만들기
            </button>
        </header>
    );
};

export default LobbyHeader;
