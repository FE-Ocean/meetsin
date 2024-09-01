import React, { useEffect } from "react";
import style from "./screen.module.scss";
import { useGetUserInfo } from "@/app/api/service/user.service";
interface IProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    currentStream: MediaStream;
}

const Screen = ({ videoRef, currentStream }: IProps) => {
    const { data: user } = useGetUserInfo();
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
