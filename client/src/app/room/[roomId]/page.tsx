"use client";
import style from "./style.module.scss";
import { useAtomValue } from "jotai";
import Menu from "@/components/menu/menu";
import { accessTokenAtom, screenShareAtom } from "@/jotai/atom";
import { useEffect, useState } from "react";
import Chat from "@/components/chat/chat";
import ScreenWindow from "@/components/screen/window/screenWindow";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/skeleton/skeleton";
import { useGetRoomData } from "@/app/api/service/room.service";
import { useParams } from "next/navigation";
import useChatSocket from "@/app/room/[roomId]/hooks/useChatSocket";
import { useScreenShare } from "./hooks/useScreenShare";

const Map = dynamic(() => import("../../../components/phaser/map/map"), {
    ssr: false,
    loading: () => <Skeleton />,
});

const Room = () => {
    const isMyScreenShare = useAtomValue(screenShareAtom);

    const [chatOpen, setChatOpen] = useState<boolean>(true);
    
    const params = useParams();
    const roomId = params.roomId as string;
    const accessToken = useAtomValue(accessTokenAtom);
    const { roomUsers, messages } = useChatSocket({ roomId });
    

    const {currentPeers, startScreenShare, stopScreenShare} = useScreenShare();

    const toggleChat = (shouldClose?: boolean) => {
        setChatOpen((prev) => (shouldClose ? false : !prev));
    };

    const {data} = useGetRoomData(roomId, accessToken);

    
    useEffect(() => {
        if (data) {
            currentPeers.current = data.userIds.map(user => ({ user, stream: undefined }));
        }
    }, [currentPeers, data]);

    // unmount 시 화면 공유 중지
    useEffect(() => {
        return () => {
            stopScreenShare();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <main className={style.main}>
                <div className={style.container}>
                    {isMyScreenShare ? <ScreenWindow peerList={currentPeers} /> : <Map />}
                    {chatOpen && <Chat messages={messages} className={style.chat} toggleChat={toggleChat} />}
                </div>
                <Menu
                    className={style.menu}
                    onScreenShare={() => {
                        isMyScreenShare ? stopScreenShare() : startScreenShare();
                    }}
                    toggleChat={toggleChat}
                    roomUsers={roomUsers}
                />
            </main>
        </>
    );
};

export default Room;
