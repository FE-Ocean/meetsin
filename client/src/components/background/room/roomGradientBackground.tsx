import React from "react";
import style from "./roomGradientBackground.module.scss";
import RoomGradientItem from "./gradient/roomGradientItem";

interface IProps {
  className?: string
}

const roomGradientBackground = ({className}: IProps) => {
    return (
        <div className={`${style.background} ${className}`}>
            <RoomGradientItem />
            <RoomGradientItem />
            <RoomGradientItem />
            <RoomGradientItem />
            <RoomGradientItem />
        </div>
    );
};

export default roomGradientBackground;