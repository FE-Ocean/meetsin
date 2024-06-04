"use client";
import style from "./style.module.scss";
import { useAtom } from "jotai";
import Menu from "@/components/menu/menu";
import { screenShareAtom } from "@/jotai/atom";
import { useEffect, useRef, useState } from "react";
import Chat from "@/components/chat/chat";
import ScreenWindow from "@/components/screen/window/screenWindow";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/skeleton/skeleton";

const Map = dynamic(() => import("../../../components/phaser/map/map"), {
    ssr: false,
    loading: () => <Skeleton />,
});

const Room = () => {
    // 들어가자마자 get [roomId] 해야함
    const [isScreenShare, setScreenShare] = useAtom(screenShareAtom);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
    const [chatOpen, setChatOpen] = useState<boolean>(true);
    const stopScreenShare = () => {
        if(!currentStream) {
            return;
        }
        currentStream.getTracks().forEach((track) => track.stop());
        setCurrentStream(null);
    };

    const toggleChat = (shouldClose?: boolean) => {
        setChatOpen((prev) => (shouldClose ? false : !prev));
    };

    // 공유 중지 시 화면 공유 창 꺼지게
    useEffect(() => {
        setScreenShare(!!currentStream);
        currentStream?.addEventListener("inactive", () => {
            setScreenShare(false);
            setCurrentStream(null);
        });
    }, [currentStream]);

    const startScreenShare = async () => {
        try {
            if (isScreenShare) {
                return;
            }
            // 스크린 크기를 고정값으로 받고 있는데, 반응형으로 받을 수 있는 방법 고려
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });
            setCurrentStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = currentStream;
            }
        } catch (error) {
            console.error(error);
            return;
        }
    };

    return (
        <>
            <main className={style.main}>
                <div className={style.container}>
                    {/* 화면 공유하는 화면을 보이게 할 지, 통상의 맵을 보이게 할 지에 대한 atom 필요할 듯, 우선은 맵이 안 정해져서 화면 공유 화면이 보이도록 함 */}
                    <Map />
                    {currentStream && <ScreenWindow videoRef={videoRef} currentStream={currentStream} />}
                    {chatOpen && <Chat className={style.chat} toggleChat={toggleChat} />}
                </div>
                <Menu
                    className={style.menu}
                    onScreenShare={() => {
                        isScreenShare ? stopScreenShare() : startScreenShare();
                    }}
                    toggleChat={toggleChat}
                />
            </main>
        </>
    );
};
export default Room;
