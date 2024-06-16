"use client";
import style from "./style.module.scss";
import { useAtom, useAtomValue } from "jotai";
import Menu from "@/components/menu/menu";
import { accessTokenAtom, screenShareAtom, userAtom } from "@/jotai/atom";
import { useEffect, useRef, useState } from "react";
import Chat from "@/components/chat/chat";
import ScreenWindow from "@/components/screen/window/screenWindow";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/skeleton/skeleton";
import { useGetRoomData } from "@/app/api/service/room.service";
import { useParams } from "next/navigation";
import Peer from "peerjs";

const Map = dynamic(() => import("../../../components/phaser/map/map"), {
    ssr: false,
    loading: () => <Skeleton />,
});

const Room = () => {
    const [isScreenShare, setScreenShare] = useAtom(screenShareAtom);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    // TODO: 스트림 배열로 변경
    const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
    const [currentUsers, setCurrentUsers] = useState<Array<string>>([]);
    const [chatOpen, setChatOpen] = useState<boolean>(true);

    const params = useParams();
    const roomId = params.roomId as string;
    const accessToken = useAtomValue(accessTokenAtom);

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

    const {data} = useGetRoomData(roomId, accessToken);

    const user = useAtomValue(userAtom);
    const peer = new Peer(user?.userId ?? "");

    // 공유 중지 시 화면 공유 창 꺼지게
    useEffect(() => {
        setScreenShare(!!currentStream);
        currentStream?.addEventListener("inactive", () => {
            setScreenShare(false);
            setCurrentStream(null);
        });
    }, [currentStream, setScreenShare]);
    
    // const user = useAtomValue(userAtom)
    // const peer = new Peer({
    //     port: 9000,
    //     path: "/peer-server",
    //     host: "localhost"
    // });

    peer.on("open", (id) => {
        console.log("My peer ID is: " + id);
    });

    useEffect(() => {
        if(data){
            setCurrentUsers([...data.userIds]);
        }
    }, [data,data?.userIds]);

    const startScreenShare = async () => {
        try {
            if (typeof window === "undefined" || isScreenShare) {
                return;
            }
            // 스크린 크기를 고정값으로 받고 있는데, 반응형으로 받을 수 있는 방법 고려
            await navigator.mediaDevices.getDisplayMedia({
                video: {
                    aspectRatio: 1920/1280
                },
            }).then(mediaStream => {
                setCurrentStream(mediaStream);
                console.log("내 스트림: " + mediaStream);
                console.log("현재 방 안에 있는 유저: " + currentUsers);
                currentUsers.forEach(user => {
                    const call = peer.call(user, mediaStream);
                    console.log("유저한테 내가 콜: "+ call);
                    call.on("stream", (remoteStream) => {
                        call.answer(remoteStream);
                        console.log("유저의 스트림: " + remoteStream);
                    });
                });
            });
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
                    {<ScreenWindow videoRef={videoRef} currentStream={currentStream} />}
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
