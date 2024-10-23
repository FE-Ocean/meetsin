import React, { useEffect } from "react";
import { screenShareStateAtom } from "@/jotai/atom";
import Screen from "@/components/screen/screen";
import style from "./screenWindow.module.scss";
import { IPeer, IScreenShareState } from "@/types/peer.type";
import { useAtomValue } from "jotai";

interface IProps {
    peerList: Map<string, IPeer>
}

const ScreenWindow = ({ peerList }: IProps) => {
    useEffect(() => {
        console.log(peerList);
    });

    const screenShareState = useAtomValue(screenShareStateAtom);
    const gridCols = Array.from(peerList.values()).filter(peer => peer.stream).length > 4 ? "over" : "under";
    // TODO: 누군가 화면 공유 시작/중지할 때마다 리스트를 새로 그려서 깜빡이는 거 같은데 방법이 없을지?
    return (
        <div className={`${style.screen_window} ${style[gridCols]}`}>
            {screenShareState !== IScreenShareState.NOT_SHARING && Array.from(peerList.values()).map((peer, index) => {
                if(peer.stream) {
                    return <Screen currentStream={peer.stream} key={index} userName={peer.user.userName} />;
                }
            })}
        </div>
    );
};

export default ScreenWindow;
