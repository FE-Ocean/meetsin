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
import useChatSocket from "@/app/room/[roomId]/hooks/useChatSocket";

const Map = dynamic(() => import("../../../components/phaser/map/map"), {
    ssr: false,
    loading: () => <Skeleton />,
});

const Room = () => {
    const [isScreenShare, setScreenShare] = useAtom(screenShareAtom);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [streamList, setStreamList] = useState<Array<MediaStream>>([]);
    const [currentUsers, setCurrentUsers] = useState<Array<string>>([]);
    const [chatOpen, setChatOpen] = useState<boolean>(true);

    const params = useParams();
    const roomId = params.roomId as string;
    const accessToken = useAtomValue(accessTokenAtom);
    const { roomUsers, messages } = useChatSocket({ roomId });

    const stopScreenShare = () => {
        if(!streamList.length) {
            return;
        }
        streamList.forEach(stream => {
            stream.getTracks().forEach((track) => track.stop());
        });
        setStreamList([]);
    };

    const toggleChat = (shouldClose?: boolean) => {
        setChatOpen((prev) => (shouldClose ? false : !prev));
    };

    const { data } = useGetRoomData(roomId, accessToken);

    const user = useAtomValue(userAtom);
    const peer = new Peer(user?.userId ?? "");

    // 공유 중지 시 화면 공유 창 꺼지게
    useEffect(() => {
        setScreenShare(!!streamList.length);
        streamList.forEach(stream => {
            stream.addEventListener("inactive", () => {
                setScreenShare(false);
                setStreamList([]);
            });
        });
    }, [setScreenShare, streamList]);
    
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
        if (data) {
            setCurrentUsers([...data.userIds]);
        }
    }, [data,data?.userIds]);
    
    useEffect(() => {
        console.log(streamList);
    }, [streamList]);

    const startScreenShare = async () => {
        try {
            if (typeof window === "undefined" || isScreenShare) {
                return;
            }
            await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: {
                        ideal: 9999,
                    },
                    aspectRatio: 1920/1280
                },
            }).then(mediaStream => {
                setStreamList([mediaStream]);
                console.log("내 스트림: " );
                console.log(mediaStream);
                console.log("현재 방 안에 있는 유저: " + currentUsers);
                currentUsers.filter(otherUser => otherUser !== user?.userId).forEach(user => {
                    const call = peer.call(user, mediaStream);
                    console.log("유저한테 내가 콜: "+ call);
                    call.on("stream", (remoteStream) => {
                        call.answer(remoteStream);
                        setStreamList([...streamList, remoteStream]);
                        console.log("유저의 스트림: " + remoteStream);
                    });
                });
            });
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
                    {isScreenShare ? <ScreenWindow streamList={streamList} /> : <Map />}
                    {chatOpen && <Chat className={style.chat} toggleChat={toggleChat} />}
                </div>
                <Menu
                    className={style.menu}
                    onScreenShare={() => {
                        isScreenShare ? stopScreenShare() : startScreenShare();
                    }}
                    toggleChat={toggleChat}
                    roomUsers={roomUsers}
                />
            </main>
        </>
    );
};
export default Room;
