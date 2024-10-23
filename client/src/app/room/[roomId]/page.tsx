"use client";
import style from "./style.module.scss";
import { useAtomValue } from "jotai";
import Menu from "@/components/menu/menu";
import { useEffect, useMemo, useState } from "react";
import { screenShareAtom } from "@/jotai/atom";
import Chat from "@/components/chat/chat";
import ScreenWindow from "@/components/screen/window/screenWindow";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/skeleton/skeleton";
import { useGetRoomData } from "@/app/api/service/room.service";
import { useParams } from "next/navigation";
import useChatSocket from "@/app/room/[roomId]/hooks/useChatSocket";
import { useScreenShare } from "./hooks/useScreenShare";
import ViewSwitchButton from "@/components/button/viewSwitchButton/viewSwitchButton";
import { IScreenShareState } from "@/types/peer.type";
import { useGetUserInfo } from "@/app/api/service/user.service";

const PhaserMap = dynamic(() => import("../../../components/phaser/map/map"), {
    ssr: false,
    loading: () => <Skeleton />,
});

const Room = () => {
    const screenShareState = useAtomValue(screenShareStateAtom);

    const [chatOpen, setChatOpen] = useState<boolean>(true);
    const [isMeetingView, setMeetingView] = useState<boolean>(false);
    
    const params = useParams();
    const roomId = params.roomId as string;
    const { roomUsers, messages } = useChatSocket({ roomId });
    const { currentPeers, startScreenShare, stopScreenShare, setPeerId, setCurrentPeers } = useScreenShare(roomId);

    const toggleChat = (shouldClose?: boolean) => {
        setChatOpen((prev) => (shouldClose ? false : !prev));
    };

    const toggleView = () => {
        setMeetingView(!isMeetingView);
    };

    const handleScreenShare = () => {
        screenShareState === IScreenShareState.SELF_SHARING ? stopScreenShare() : startScreenShare();
    };

    const { data } = useGetRoomData(roomId);
    const { data: user } = useGetUserInfo();

    const isScreenSharing = useMemo(() => {
        return screenShareState !== IScreenShareState.NOT_SHARING;
    }, [screenShareState]);

    useEffect(() => {
        if(screenShareState === IScreenShareState.SELF_SHARING) {
            setMeetingView(true);
        }
        else if(screenShareState === IScreenShareState.NOT_SHARING) {
            setMeetingView(false);
        }
    }, [screenShareState]);

    useEffect(() => {
        if (data) {
            const tempPeers = new Map();
            data.userIds.forEach(user => {
                tempPeers.set(setPeerId(user.userId), {
                    user,
                    peerId: setPeerId(user.userId),
                    stream: undefined,
                    connection: undefined
                });
            });
            setCurrentPeers(tempPeers);
        }
    }, [data, setCurrentPeers, setPeerId]);

    // unmount 시 화면 공유 중지 및 모든 연결 해제
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
                    <ViewSwitchButton className={style.switch} disabled={!isScreenSharing} isMeetingView={isMeetingView} onClick={toggleView} />
                    {isMeetingView ? <ScreenWindow peerList={currentPeers} /> : <PhaserMap />}
                    {chatOpen && <Chat messages={messages} className={style.chat} toggleChat={toggleChat} />}
                </div>
                <Menu
                    className={style.menu}
                    onScreenShare={handleScreenShare}
                    toggleChat={toggleChat}
                    roomUsers={roomUsers}
                />
            </main>
        </>
    );
};

export default Room;
