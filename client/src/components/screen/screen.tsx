import React, { useEffect, useRef } from "react";
import style from "./screen.module.scss";
import { useAtomValue } from "jotai";
import { userAtom } from "@/jotai/atom";
interface IProps {
    currentStream: MediaStream
}

const Screen = ({ currentStream }: IProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const user = useAtomValue(userAtom);
    useEffect(() => {
        if (videoRef && videoRef.current && currentStream) {
            videoRef.current.srcObject = currentStream;
        }
    }, [videoRef, currentStream]);

    return (
        <div className={style.screen_container}>
            <video className={style.screen} autoPlay={true} ref={videoRef} />
            <span className={style.user_name}>{user?.userName}</span>
        </div>
    );
};

export default Screen;
