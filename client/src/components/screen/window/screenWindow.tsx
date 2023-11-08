import React from "react";
import { useAtomValue } from "jotai";
import { screenShareAtom } from "@/jotai/atom";
import Screen from "@/components/screen/screen";
import style from "./screen_window.module.scss";

const ScreenWindow = ({ videoRef, currentStream }) => {
    const isScreenShare = useAtomValue(screenShareAtom);
    return (
        <div className={style.screen_window}>
            {isScreenShare && <Screen videoRef={videoRef} stream={currentStream} />}
        </div>
    );
};

export default ScreenWindow;
