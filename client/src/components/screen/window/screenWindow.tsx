import React from "react";
import { useAtomValue } from "jotai";
import { screenShareAtom } from "@/jotai/atom";
import Screen from "@/components/screen/screen";
import style from "./screenWindow.module.scss";
import { IPeer } from "@/types/peer.type";

interface IProps {
    peerList: Array<IPeer>
}

const ScreenWindow = ({ peerList }: IProps) => {
    const isScreenShare = useAtomValue(screenShareAtom);
    const gridCols = peerList.length > 4 ? "over" : "under";
    return (
        <div className={`${style.screen_window} ${style[gridCols]}`}>
            {isScreenShare && peerList.map((peer, index) => {
                if(peer.stream) {
                    return <Screen currentStream={peer.stream} key={index} userName={peer.user.userName} />;
                }
            })}
        </div>
    );
};

export default ScreenWindow;
