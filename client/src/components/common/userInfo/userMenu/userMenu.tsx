import Image from "next/image";
import UserMenuItem from "../userMenuItem/userMenuItem";
import style from "./userMenu.module.scss";

interface IUserMenu {
    className?: string;
}

const USER_MENU = [
    {
        icon: <Image width={24} height={24} src="/setting.svg" alt="환경설정 아이콘" />,
        label: "Setting",
    },
    {
        icon: <Image width={24} height={24} src="/door-exit.svg" alt="로그아웃 아이콘" />,
        label: "Logout",
    },
];

const UserMenu = (props: IUserMenu) => {
    const { className } = props;

    return (
        <div className={`${style.wrapper} ${className}`}>
            {USER_MENU.map((menu, index) => (
                <UserMenuItem key={index} icon={menu.icon} label={menu.label} />
            ))}
        </div>
    );
};

export default UserMenu;
