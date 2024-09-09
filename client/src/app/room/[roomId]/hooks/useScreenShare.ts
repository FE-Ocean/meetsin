import { screenShareAtom, userAtom } from "@/jotai/atom";
import { IPeer } from "@/types/peer.type";
import { useAtomValue, useSetAtom } from "jotai";
import Peer from "peerjs";
import { useEffect, useMemo, useRef, useState } from "react";

export const useScreenShare = () => {
    const currentPeers = useRef<Array<IPeer>>([]);
    const [peer, setPeer] = useState<Peer | null>(null);
    
    const [connections, setConnections] = useState<{ [key: string]: any }>({});
    const [connectionState, setConnectionState] = useState<string>("disconnected");

    const user = useAtomValue(userAtom);
    const setMyScreenShare = useSetAtom(screenShareAtom);
    
    
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
                
                    currentPeers.current = currentPeers.current.map(peer =>
                        peer.user.userId === connection.peer ? { ...peer, stream: undefined } : peer
                    );
                } else if (data.type === "request-screen-share") {
                    // Respond with the current stream if available
                    const peer = currentPeers.current.find(peer => peer.user.userId === user.userId);
                    if (peer && peer.stream) {
                        newPeer.call(connection.peer, peer.stream);
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

            
            return () => {
                newPeer.removeAllListeners();
            };
        });

        // connections.on("data", (data) => {
        //     if (data.type === "screen-share-started") {
        //         console.log("다른 사용자가 화면을 공유하고 있습니다.");
        //         // 화면 공유 상태를 업데이트하는 로직 추가
        //     }
        // });

        newPeer.on("close", () => {
            console.log("Peer connection closed");
            setConnectionState("closed");

            
            return () => {
                newPeer.removeAllListeners();
            };
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
                currentPeers.current.forEach(peer =>{ 
                    if(peer.user.userId === mediaConnection.peer) {
                        peer.stream = remoteStream;
                    }
                });
                setConnectionState("in call");
            });
        });

        return () => {
            newPeer.destroy();
        };
    }, [currentPeers, user]);

    
    /** @description
     * 나 포함 한 명이라도 화면 공유 중인지 상태
     */
    const isScreenShare = useMemo(() => {
        currentPeers.current.some(peer => {
            return peer.stream;
        });
    }, [currentPeers]);
    

    const startScreenShare = async () => {
        try {
            if(!user) {
                throw new Error("user not found");
            }
            if(!peer) {
                throw new Error("peer not found");
            }
            // 화면 공유 스트림 받아오기
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 9999 },
                    aspectRatio: 1920 / 1280
                }
            });
            // 스트림이 종료되면 화면 공유 중지
            mediaStream.getTracks().forEach(track => {
                track.onended = () => {
                    stopScreenShare();
                };
            });
            // 방에 있는 사람들에게 연결
            currentPeers.current.forEach(p => {
                if(p.user.userId === user.userId) {
                    p.stream = mediaStream;
                    setMyScreenShare(true);
                    connections.send({ type: "screen-share-started" });
                }
                else {
                    const call = peer.call(p.user.userId, mediaStream);
                    if (!call) {
                        console.error("Failed to establish call with user:", p);
                        return;
                    }
                    call.on("stream", (remoteStream) => {
                        console.log("Received remote stream during call:", remoteStream);
                        currentPeers.current = currentPeers.current.map(peer => 
                            peer.user.userId === p.user.userId ? { ...peer, stream: remoteStream } : peer
                        );
                    });
                    call.on("close", () => {
                        console.log("Call closed with user:", p);
                    });
                    call.on("error", (error) => {
                        console.error("Call error with user:", p, error);
                    });

                    // Establish data connection
                    const connection = peer.connect(p.user.userId);
                    connection.on("open", () => {
                        console.log("Data connection open with:", p.user.userId);
                        setConnections(prev => ({ ...prev, [connection.peer]: connection }));
                        // Request their current screen share if available
                        connection.send({ type: "request-screen-share" });
                    });
                    connection.on("data", (data) => {
                        if (data.type === "screen-share-stopped") {
                            currentPeers.current = currentPeers.current.map(peer =>
                                peer.user.userId === connection.peer ? { ...peer, stream: undefined } : peer
                            );
                        }
                    });
                }
            });

        } catch (error) {
            console.error("Error starting screen share:", error);
        }
    };

    const stopScreenShare = () => {
        currentPeers.current = currentPeers.current.map(peer => {
            if (peer.stream) {
                peer.stream.getTracks().forEach((track) => track.stop());
            }
            return { ...peer, stream: undefined };
        });
        setMyScreenShare(false);

        // Notify other peers that screen sharing has stopped
        Object.values(connections).forEach(conn => {
            conn.send({ type: "screen-share-stopped" });
        });
    };

    return {
        peer,
        currentPeers,
        isScreenShare,
        startScreenShare,
        stopScreenShare
    };
};
