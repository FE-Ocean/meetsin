import React, { MutableRefObject } from "react";
import { useAtomValue } from "jotai";
import { screenShareAtom } from "@/jotai/atom";
import Screen from "@/components/screen/screen";
import style from "./screenWindow.module.scss";
import { IPeer } from "@/types/peer.type";

interface IProps {
    peerList: MutableRefObject<Array<IPeer>>
}

const ScreenWindow = ({ peerList }: IProps) => {
    const isScreenShare = useAtomValue(screenShareAtom);
    const gridCols = peerList.current.length > 4 ? "over" : "under";

    return (
        <div className={`${style.screen_window} ${style[gridCols]}`}>
            {isScreenShare && peerList.current.filter(peer => peer.stream).map((peer, index) => {
                if(peer.stream) {
                    return <Screen currentStream={peer.stream} key={index} userName={peer.user.userName} />;
                }
            })
            }</div>
    );
};

export default ScreenWindow;
