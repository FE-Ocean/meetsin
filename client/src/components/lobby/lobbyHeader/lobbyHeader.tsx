"use client";

import UserInfo from "@/components/common/userInfo/userInfo";
import style from "./lobbyHeader.module.scss";
import useModal from "@/components/modal/hooks/useModal";
import Button from "@/components/common/button/button";

const LobbyHeader = () => {
    const { onOpen } = useModal("createRoom");

    return (
        <header className={style.header}>
            <UserInfo direction="bottom" />
            <Button type="button" look="solid" text="방 만들기" onClick={onOpen} width={128} bold />
        </header>
    );
};

export default LobbyHeader;
