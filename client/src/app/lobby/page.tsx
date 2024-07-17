"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "@/jotai/atom";
import { useGetUserRooms } from "../api/service/room.service";
import { IRoom } from "@/types/room";
import useModal from "@/hooks/useModal";
import UserInfo from "@/components/common/userInfo/userInfo";
import RoomCard from "@/components/room/roomCard/roomCard";
import style from "./style.module.scss";
import Link from "next/link";

const Lobby = () => {
    const { onOpen } = useModal("createRoom");

    const accessToken = useAtomValue(accessTokenAtom);
    const [userRooms, setUserRoom] = useState<IRoom[]>([]);

    const { data } = useGetUserRooms(accessToken);

    useEffect(() => {
        if (data) {
            setUserRoom(data);
        }
    }, [data]);

    return (
        <>
            <header className={style.header}>
                <UserInfo direction="bottom" />
                <button className={style.create_room} type="button" onClick={onOpen}>
                    방 만들기
                </button>
            </header>
            <main className={style.main}>
                {userRooms.length === 0 && (
                    <div className={style.no_room_container}>
                        <p className={style.title}>
                            오른쪽 상단의 버튼을 클릭해 방을 개설해 보세요!
                        </p>
                    </div>
                )}

                {userRooms.length > 0 && (
                    <div className={style.room_container}>
                        <h2 className={style.title}>내가 만든 방들</h2>
                        <p className={style.description}>
                            여기에는 내가 개설한 방들이 표시됩니다. 각 방을 클릭하여 접속하고,
                            <br />
                            마우스를 올리면 이름을 변경하거나 삭제할 수 있습니다. <br />
                            새로운 방을 만들고 싶다면 화면의 오른쪽 상단에 있는 버튼을 클릭하세요.
                        </p>
                        <Link href={"/room/6697c265964adc013f74ef83"}>테스트 링크</Link>
                        <ul className={style.room_cards}>
                            {userRooms.map((room: IRoom) => {
                                return (
                                    <li key={room.id}>
                                        <RoomCard room={room} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </main>
        </>
    );
};
export default Lobby;
