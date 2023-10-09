import React from "react";
import { useAtomValue } from "jotai";
import style from "./screen_window.module.scss";
import { screenShareAtom } from "@/store/store";
import Screen from "@/components/screen/screen";

const ScreenWindow = ({ videoRef, currentStream }) => {
  const isScreenShare = useAtomValue(screenShareAtom);
  return (
    <div className={style.screen_window}>
      {isScreenShare && <Screen videoRef={videoRef} stream={currentStream} />}
    </div>
  );
};

export default ScreenWindow;
