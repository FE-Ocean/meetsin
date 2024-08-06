"use client";
import style from "./style.module.scss";
import { useAtom, useAtomValue } from "jotai";
import Menu from "@/components/menu/menu";
import { accessTokenAtom, screenShareAtom, userAtom } from "@/jotai/atom";
import { useEffect, useState } from "react";
import Chat from "@/components/chat/chat";
import ScreenWindow from "@/components/screen/window/screenWindow";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/skeleton/skeleton";
import { useGetRoomData } from "@/app/api/service/room.service";
import { useParams } from "next/navigation";
import Peer from "peerjs";
import useChatSocket from "@/app/room/[roomId]/hooks/useChatSocket";
import { IPeer } from "@/types/peer.type";

const Map = dynamic(() => import("../../../components/phaser/map/map"), {
    ssr: false,
    loading: () => <Skeleton />,
});

const Room = () => {
    const [isScreenShare, setScreenShare] = useAtom(screenShareAtom);
    const [currentPeers, setCurrentPeers] = useState<Array<IPeer>>([]);
    const [chatOpen, setChatOpen] = useState<boolean>(true);
    
    const [peer, setPeer] = useState<Peer | null>(null);
    const [connections, setConnections] = useState<{ [key: string]: any }>({});
    const [connectionState, setConnectionState] = useState<string>("disconnected");

    const params = useParams();
    const roomId = params.roomId as string;
    const accessToken = useAtomValue(accessTokenAtom);
    const { roomUsers, messages } = useChatSocket({ roomId });

    const stopScreenShare = () => {
        currentPeers.forEach(peer => {
            if (peer.stream) {
                peer.stream.getTracks().forEach((track) => track.stop());
                peer.stream = undefined;
            }
        });
        setCurrentPeers(currentPeers.map(peer => ({ ...peer, stream: undefined })));
        setScreenShare(false);

        // Notify other peers that screen sharing has stopped
        Object.values(connections).forEach(conn => {
            conn.send({ type: "screen-share-stopped" });
        });
    };

    const toggleChat = (shouldClose?: boolean) => {
        setChatOpen((prev) => (shouldClose ? false : !prev));
    };

    const { data } = useGetRoomData(roomId, accessToken);
    const user = useAtomValue(userAtom);

    useEffect(() => {
        if (!user) return;

        const newPeer = new Peer(user.userId);
        console.log("Peer created with ID:", newPeer.id);
        setPeer(newPeer);

        newPeer.on("open", (id) => {
            console.log("My peer ID is: " + id);
            setConnectionState("connected");
        });

        newPeer.on("connection", (connection) => {
            console.log("New connection: ", connection);
            connection.on("data", (data) => {
                if (data.type === "screen-share-stopped") {
                    setCurrentPeers(prevPeers =>
                        prevPeers.map(peer =>
                            peer.user.userId === connection.peer ? { ...peer, stream: undefined } : peer
                        )
                    );
                } else if (data.type === "request-screen-share") {
                    // Respond with the current stream if available
                    const peer = currentPeers.find(peer => peer.user.userId === user.userId);
                    if (peer && peer.stream) {
                        const call = newPeer.call(connection.peer, peer.stream);
                        console.log("Responding with current stream to:", connection.peer);
                    }
                }
            });
            setConnections(prev => ({ ...prev, [connection.peer]: connection }));
            setConnectionState("connected");
        });

        newPeer.on("disconnected", () => {
            console.log("Peer disconnected");
            setConnectionState("disconnected");
        });

        newPeer.on("close", () => {
            console.log("Peer connection closed");
            setConnectionState("closed");
        });

        newPeer.on("error", (err) => {
            console.error("Peer connection error: ", err);
            setConnectionState("error");
        });

        newPeer.on("call", (mediaConnection) => {
            console.log("Incoming call from:", mediaConnection.peer);
            mediaConnection.answer();
            mediaConnection.on("stream", (remoteStream) => {
                console.log("Received remote stream from:", mediaConnection.peer);
                setCurrentPeers(prevPeers => 
                    prevPeers.map(peer => 
                        peer.user.userId === mediaConnection.peer ? { ...peer, stream: remoteStream } : peer
                    )
                );
                setConnectionState("in call");
            });
        });

        return () => {
            newPeer.destroy();
        };
    }, [user]);

    useEffect(() => {
        if (data) {
            setCurrentPeers(data.userIds.map(user => ({ user, stream: undefined })));
        }
    }, [data]);

    useEffect(() => {
        // Update isScreenShare only based on the user's own stream
        const myStream = currentPeers.find(peer => peer.user.userId === user?.userId)?.stream;
        setScreenShare(!!myStream);
    }, [currentPeers, setScreenShare, user]);

    const startScreenShare = async () => {
        if (!user || !peer || isScreenShare || typeof window === "undefined") return;

        try {
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 9999 },
                    aspectRatio: 1920 / 1280
                }
            });

            // Add event listener to detect when the user stops sharing from the browser panel
            mediaStream.getTracks().forEach(track => {
                track.onended = () => {
                    stopScreenShare();
                };
            });

            setCurrentPeers(prevPeers => 
                prevPeers.map(p => p.user.userId === user.userId ? { ...p, stream: mediaStream } : p)
            );

            currentPeers.forEach(p => {
                if (p.user.userId !== user.userId) {
                    const call = peer.call(p.user.userId, mediaStream);
                    if (!call) {
                        console.error("Failed to establish call with user:", p);
                        return;
                    }
                    call.on("stream", (remoteStream) => {
                        console.log("Received remote stream during call:", remoteStream);
                        setCurrentPeers(prevPeers => 
                            prevPeers.map(peer => 
                                peer.user.userId === p.user.userId ? { ...peer, stream: remoteStream } : peer
                            )
                        );
                    });
                    call.on("close", () => {
                        console.log("Call closed with user:", p);
                    });
                    call.on("error", (err) => {
                        console.error("Call error with user:", p, err);
                    });

                    // Establish data connection
                    const conn = peer.connect(p.user.userId);
                    conn.on("open", () => {
                        console.log("Data connection open with:", p.user.userId);
                        setConnections(prev => ({ ...prev, [conn.peer]: conn }));
                        // Request their current screen share if available
                        conn.send({ type: "request-screen-share" });
                    });
                    conn.on("data", (data) => {
                        if (data.type === "screen-share-stopped") {
                            setCurrentPeers(prevPeers =>
                                prevPeers.map(peer =>
                                    peer.user.userId === conn.peer ? { ...peer, stream: undefined } : peer
                                )
                            );
                        }
                    });
                }
            });

        } catch (error) {
            console.error("Error starting screen share:", error);
        }
    };

    return (
        <>
            <main className={style.main}>
                <div className={style.container}>
                    {isScreenShare ? <ScreenWindow peerList={currentPeers} /> : <Map />}
                    {chatOpen && <Chat messages={messages} className={style.chat} toggleChat={toggleChat} />}
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
