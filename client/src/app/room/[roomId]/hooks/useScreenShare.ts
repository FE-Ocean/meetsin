import { screenShareAtom, userAtom } from "@/jotai/atom";
import { IPeer } from "@/types/peer.type";
import { useAtomValue, useSetAtom } from "jotai";
import Peer from "peerjs";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

export const useScreenShare = (roomId: string) => {
    const currentPeers = useRef<Map<string, IPeer>>(new Map());
    const [peer, setPeer] = useState<Peer | null>(null);
    const [, updatePeerState] = useState(0);
    
    const user = useAtomValue(userAtom);
    const setMyScreenShare = useSetAtom(screenShareAtom);

    // useRef로 쓰인 currentPeers의 리렌더링을 위함
    const forceUpdatePeers = useCallback((key: string, value: IPeer)=> {
        const tempPeerMap = new Map(currentPeers.current);
        tempPeerMap.set(key, value);
        currentPeers.current = tempPeerMap;
        updatePeerState(prev => prev+1);
    }, []);

    // 피어 아이디 중복 방지를 위함
    const setPeerId = useCallback((userId: string) => {
        return `meetsin${roomId}${userId}`;
    }, [roomId]);

    useEffect(() => {
        if (!user) return;
        const myPeerId = setPeerId(user.userId);
        const newPeer = new Peer(myPeerId);
        console.log("Peer created with ID:", newPeer.id);
        setPeer(newPeer);

        // 피어 생성 시
        newPeer.on("open", (id) => {
            console.log("My peer ID is: " + id);
        });

        // 다른 피어와의 연결
        newPeer.on("connection", (connection) => {
            connection.on("data", (data) => {
                const peerData = currentPeers.current.get(connection.peer);
                if(!peerData) {
                    return;
                } 
                peerData.connection = connection;

                // connection.send로 오는 메시지에 따라 처리
                switch(data.type) {
                case "stop-screen-share": // 피어가 화면 공유를 멈춘 경우
                    peerData.stream = undefined;
                case "request-screen-share": // 피어에게서 내 스트림을 요청받은 경우
                    const myPeer = currentPeers.current.get(setPeerId(user.userId));
                    if (myPeer && myPeer.stream) {
                        newPeer.call(connection.peer, myPeer.stream);
                        console.log("Responding with current stream to:", connection.peer);
                    }
                default: 
                    forceUpdatePeers(connection.peer, peerData);
                    break;
                }
            });

            return () => {
                newPeer.destroy();
            };
        });

        // 피어 연결 끊길 시
        newPeer.on("disconnected", (data) => {
            console.log("disconnected", data);
            console.log("Peer disconnected");
        });

        // 피어 닫힐 시
        newPeer.on("close", () => {
            console.log("Peer connection closed");
            return () => {
                newPeer.removeAllListeners();
            };
        });

        // 에러 처리
        newPeer.on("error", (err) => {
            console.error("Peer connection error: ");
            console.log("Error type:", err.type); // 에러 유형 출력
            console.log("Error message:", err.message); // 에러 메시지 출력
            if (err.type === "unavailable-id") {
                // id 중복 방지 -> 이미 같은 아이디의 피어가 존재할 시 피어 죽이고 같은 아이디로 재생성
                // setPeerId에 의해 유저끼리 아이디가 같을 수가 없으므로
                newPeer.destroy(); // 이전 피어 강제 종료
                const tempPeer = new Peer(myPeerId); // 같은 ID로 피어 재생성
                setPeer(tempPeer);
            }
        });

        // 다른 피어로부터 콜을 받았을 때
        newPeer.on("call", (mediaConnection) => {
            console.log("Incoming call from:", mediaConnection.peer);
            mediaConnection.answer();
            // 다른 피어의 스트림을 받았을 때
            mediaConnection.on("stream", (remoteStream) => {
                const peerData = currentPeers.current.get(mediaConnection.peer);
                if(peerData) {
                    console.log("Received remote stream from:", mediaConnection.peer);
                    peerData.stream = remoteStream;
                    forceUpdatePeers(mediaConnection.peer, peerData);
                }
            });
        });

        return () => {
            newPeer.destroy();
        };
    }, [currentPeers, forceUpdatePeers, roomId, setPeerId, user]);

    // 화면 공유 중인 스트림 리스트
    const streamList = useMemo(() => {
        return Array.from(currentPeers.current.values()).filter(peer => peer.stream);
    }, []);

    // 나 포함 한 명이라도 화면 공유 중인지 상태
    const isScreenSharing = useMemo(() => {
        Array.from(currentPeers.current.values()).some(peer => {
            return peer.stream;
        });
    }, [currentPeers]);
    
    // 화면 공유 시작 메서드
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
                const peerData = currentPeers.current.get(p.peerId);
                if(p.peerId === setPeerId(user.userId) && peerData) {
                    peerData.stream = mediaStream;
                    forceUpdatePeers(p.peerId, peerData);
                    setMyScreenShare(true);
                }
                else {
                    const call = peer.call(p.peerId, mediaStream);
                    if (!call) {
                        console.error("Failed to establish call with user:", p);
                        return;
                    }
                    
                    // 다른 피어의 스트림을 받았을 때
                    call.on("stream", (remoteStream) => {
                        console.log("Received remote stream during call:", remoteStream);
                        if(peerData) {
                            peerData.stream = remoteStream;
                            forceUpdatePeers(p.peerId, peerData);
                        }
                    });

                    // 콜이 끊겼을 때
                    call.on("close", () => {
                        console.log("Call closed with user:", p);
                        if(peerData) {
                            peerData.stream = undefined;
                            forceUpdatePeers(p.peerId, peerData);
                        }
                    });
                    call.on("error", (error) => {
                        console.error("Call error with user:", p, error);
                    });

                    const connection = peer.connect(p.peerId);

                    // 다른 피어와의 연결 생성 시
                    connection.on("open", () => {
                        console.log("Data connection open with:", p.peerId);
                        if(peerData) {
                            peerData.connection = connection;forceUpdatePeers(p.peerId, peerData);
                        }
                        // 내 화면 공유 시작했음을 전송
                        // TODO: 내 화면 공유 중인 상태는 isMyScreenShare로 구분하고 있으므로 쓸모없다면 삭제
                        connection.send({ type: "start-screen-share" });
                        // 다른 피어가 이미 화면 공유 중인 경우 그걸 가져오기 위하여 요청 전송
                        connection.send({ type: "request-screen-share" });
                    });

                    // 다른 피어에서 데이터 전송 받을 시
                    connection.on("data", (data) => {
                        // 다른 피어가 화면 공유를 종료 시
                        if (data.type === "screen-share-stopped") {
                            if(peerData) {
                                peerData.stream = undefined;
                                forceUpdatePeers(p.peerId, peerData);
                            }
                        }
                    });
                }
            });

        } catch (error) {
            console.error("Error starting screen share:", error);
        }
    };

    // 화면 공유 중지 메서드
    const stopScreenShare = () => {
        if(!user || !peer){
            return;
        }
        currentPeers.current.forEach((peerData, peerId) => {
            // 내가 화면 공유를 중지했음을 다른 피어에게 전송
            if(peerData.connection) {
                peerData.connection.send({ type: "stop-screen-share" });
            }
            // 나의 스트림을 비활성화
            if(peerId === setPeerId(user.userId) && peerData.stream) {
                peerData.stream.getTracks().forEach((track) => track.stop());
                peerData.stream = undefined;
            }
            forceUpdatePeers(peerId, peerData);
        });
        setMyScreenShare(false);
    };

    return {
        peer,
        currentPeers,
        isScreenSharing,
        startScreenShare,
        stopScreenShare,
        setPeerId,
        streamList
    };
};
