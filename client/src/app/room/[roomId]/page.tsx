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
    const [peer, setPeer] = useState<Peer| null>(null);
    const [isScreenShare, setScreenShare] = useAtom(screenShareAtom);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [streamList, setStreamList] = useState<Array<MediaStream>>([]);
    const [currentUsers, setCurrentUsers] = useState<Array<string>>([]);
    const [chatOpen, setChatOpen] = useState<boolean>(true);

    const params = useParams();
    const roomId = params.roomId as string;
    const accessToken = useAtomValue(accessTokenAtom);

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

    const {data} = useGetRoomData(roomId, accessToken);

    const user = useAtomValue(userAtom);
    // const peer = new Peer(user?.userId ?? "");

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

    useEffect(() => {
        if(!user) {
            return;
        }
        if (!isScreenShare) {
            console.error("No screen sharing stream to answer with");
            return;
        }
        const newPeer = new Peer(user.userId);
        setPeer(newPeer);
        newPeer.on("open", (id) => {
            console.log("My peer ID is: " + id);
        });
        
        newPeer.on("call", (call) => {
            call.answer();
            call.on("stream", (remoteStream) => {
                setStreamList([...streamList, remoteStream]);
            });

            call.on("error", (err) => {
                console.error("Call error:", err);
            });

            newPeer.on("error", (err) => {
                console.error("Peer error:", err);
            });
        });

        return () => {
            newPeer.destroy();
        };
    }, [peer, streamList, user]);
    

    useEffect(() => {
        if(data){
            setCurrentUsers([...data.userIds]);
        }
    }, [data,data?.userIds]);
    
    useEffect(() => {
        console.log(streamList);
    }, [streamList]);

    const startScreenShare = async () => {
        if(!user){
            console.log("user not found");
            return;
        }
        if(!peer) {
            console.log("peer not found");
            return;
        }
        try {
            if (typeof window === "undefined" || isScreenShare) {
                return;
            }
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: {
                        ideal: 9999,
                    },
                    aspectRatio: 1920/1280
                },
            });
            setStreamList([mediaStream]);
            console.log("내 스트림: ", mediaStream);
            console.log("현재 방 안에 있는 유저: ", currentUsers);
            console.log(currentUsers.filter(otherUser => otherUser !== user.userId));
                    
                       
            currentUsers.filter(otherUser => otherUser !== user.userId).forEach(user => {
                const call = peer.call(user, mediaStream);
                // call.answer(mediaStream);
                if (!call) {
                    console.error("Failed to establish call with user:", user);
                    return;
                }
                console.log("유저한테 내가 콜: ", call); // 이게 undefined (화면공유 껐다켰다할시)
                // 이 안의 콘솔은 안찍힘
                call.on("stream", (remoteStream) => {
                    setStreamList([...streamList, remoteStream]);
                    console.log("유저의 스트림: ", remoteStream);
                });
                call.on("error", (err) => {
                    console.error("Call error with user:", user, err);
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
                />
            </main>
        </>
    );
};
export default Room;
