import React from "react";
import { useAtomValue } from "jotai";
import { screenShareAtom } from "@/jotai/atom";
import Screen from "@/components/screen/screen";
import style from "./screenWindow.module.scss";

interface IProps {
    streamList: Array<MediaStream>
}

const ScreenWindow = ({ streamList }: IProps) => {
    const isScreenShare = useAtomValue(screenShareAtom);
    const gridCols = streamList.length > 4 ? "over" : "under";
    return (
        <div className={`${style.screen_window} ${style[gridCols]}`}>
            {isScreenShare && streamList.map((stream, index) => {
                return <Screen currentStream={stream} key={index} />;
            })
            }</div>
    );
};

export default ScreenWindow;
