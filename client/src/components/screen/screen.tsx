import React, { useEffect } from "react";
import style from "./screen.module.scss";
import { useAtomValue } from "jotai";
import { userAtom } from "@/jotai/atom";
interface IProps {
    videoRef: React.RefObject<HTMLVideoElement>,
    currentStream: MediaStream
}

const Screen = ({ videoRef, currentStream }: IProps) => {
    const user = useAtomValue(userAtom);
    useEffect(() => {
        if (videoRef && videoRef.current && currentStream) {
            videoRef.current.srcObject = currentStream;
        }
    }, [videoRef, currentStream]);

    return (
        <div className={style.screen_container}>
            <video className={style.screen} autoPlay={true} ref={videoRef}></video>
            <span className={style.user_name}>{user?.userName}</span>
        </div>
    );
};

export default Screen;
