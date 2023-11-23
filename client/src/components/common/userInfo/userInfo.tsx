"use client";

import { useState } from "react";
import UserButton from "./userButton/userButton";
import UserMenu from "./userMenu/userMenu";
import style from "./userInfo.module.scss";

interface IUserInfo {
    direction?: "top" | "bottom";
}

const UserInfo = (props: IUserInfo) => {
    const { direction = "top" } = props;

    const [menuOpen, setMenuOpen] = useState(false);

    const handleUserButtonClick = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div className={style.wrapper}>
            <UserButton onClick={handleUserButtonClick} />
            {menuOpen && <UserMenu className={`${style.user_menu} ${style[direction]}`} />}
        </div>
    );
};

export default UserInfo;
