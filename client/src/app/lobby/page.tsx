"use client";

import { useState } from "react";
import Button from "@/components/common/button/button";
import UserInfo from "@/components/common/userInfo/userInfo";
import CreateRoom from "@/components/createRoom/createRoom";
import style from "./style.module.scss";

const Lobby = () => {
    const [isCreateRoomVisible, setCreateRoomVisible] = useState(false);

    const showCreateRoom = () => {
        setCreateRoomVisible(!isCreateRoomVisible);
    };

    return (
        <>
            <header className={style.header}>
                <UserInfo direction="bottom" />
            </header>
            <main className={style.main}>
                {isCreateRoomVisible ? (
                    <CreateRoom setCreateRoomVisible={setCreateRoomVisible} />
                ) : (
                    <Button
                        text="방 만들기"
                        type="submit"
                        onClick={showCreateRoom}
                        look="solid"
                        width={110}
                    />
                )}
            </main>
        </>
    );
};
export default Lobby;
