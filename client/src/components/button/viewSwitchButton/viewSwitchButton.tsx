import React, { MouseEventHandler } from "react";
import style from "./viewSwitchButton.module.scss";
import Image from "next/image";

interface IProps {
    className: string
    disabled: boolean
    isMeetingView: boolean
    onClick: MouseEventHandler
}

const viewSwitchButton = ({className, disabled, isMeetingView, onClick}: IProps) => {
    const buttonType = isMeetingView ? "meeting" : "map";
    const icon = isMeetingView ? "/chevron_left.svg" : "/device-desktop.svg";
    const text = isMeetingView ? "Return" : "Show Shared Screen";
    return (
        <button className={`${style.button} ${style[buttonType]} ${className}`} disabled={disabled} onClick={onClick}>
            <Image src={icon} alt="show shared screen" width={18} height={18} className={style.icon}/>
            {text}
        </button>
    );
};

export default viewSwitchButton;