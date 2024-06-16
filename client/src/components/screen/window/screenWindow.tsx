import React from "react";
import { useAtomValue } from "jotai";
import { screenShareAtom } from "@/jotai/atom";
import Screen from "@/components/screen/screen";
import style from "./screenWindow.module.scss";

interface IProps {
    videoRef: React.RefObject<HTMLVideoElement>,
    currentStream: MediaStream | null
}

const ScreenWindow = ({ videoRef, currentStream }: IProps) => {
    const isScreenShare = useAtomValue(screenShareAtom);
    return (
        <div className={style.screen_window}>
            {isScreenShare && currentStream && <Screen videoRef={videoRef} currentStream={currentStream} />}
        </div>
    );
};

export default ScreenWindow;
