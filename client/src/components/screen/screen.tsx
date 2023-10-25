import React, { useEffect, useRef } from "react";
import style from "./screen.module.scss";

const Screen = ({ videoRef, stream }) => {
    useEffect(() => {
        if (videoRef && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [videoRef, stream]);

    return (
        <div className={style.screen_container}>
            <video className={style.screen} autoPlay={true} ref={videoRef}></video>
            <span className={style.user_name}>Username</span>
        </div>
    );
};

export default Screen;
