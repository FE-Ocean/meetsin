import { screenShareAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import Peer from "peerjs";
import { useRef, useState } from "react";

export const useScreenShare = () => {
    
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
    
    const [isScreenShare, setScreenShare] = useAtom(screenShareAtom);

    // const user = useAtomValue(userAtom)
    const peer = new Peer();
    peer.on("open", (id: string) => {
        console.log("My peer ID is: " + id);
    });

    const startScreenShare = async () => {
        try {
            if (isScreenShare) {
                return;
            }
            // 스크린 크기를 고정값으로 받고 있는데, 반응형으로 받을 수 있는 방법 고려
            // const stream = await navigator.mediaDevices.getDisplayMedia({
            //     video: true,
            // });
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            
            // another-peers-id 수정
            const call = peer.call("another-peers-id", stream);

            peer.on("call", (call) => {
                console.log("in peer call", call);
                call.answer(stream);
                call.on("stream", (remoteStream: any) => {
                    console.log("in peer call stream", remoteStream);
                    // Show stream in some <video> element.
                    // setCurrentStream(remoteStream);
                    // if (videoRef.current) {
                    //     videoRef.current.srcObject = currentStream;
                    // }
                });
            });
        
            call.on("stream", (remoteStream: any) => {
                console.log("in call stream", remoteStream);
                // Show stream in some <video> element.
                // setCurrentStream(remoteStream);
                // if (videoRef.current) {
                //     videoRef.current.srcObject = currentStream;
                // }
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
    const stopScreenShare = () => {
        if(currentStream) {
            currentStream.getTracks().forEach((track: { stop: () => any; }) => track.stop());
            setCurrentStream(null);
        }
    };
    return { videoRef, currentStream, setCurrentStream, startScreenShare, stopScreenShare };
};