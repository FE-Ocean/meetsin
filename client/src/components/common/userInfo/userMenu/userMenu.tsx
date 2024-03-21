import Image from "next/image";
import UserMenuItem from "../userMenuItem/userMenuItem";
import style from "./userMenu.module.scss";
import { useSetAtom } from "jotai";
import { accessTokenAtom, userAtom } from "@/jotai/atom";

interface IUserMenu {
    className?: string;
}

const UserMenu = (props: IUserMenu) => {

    const setUser = useSetAtom(userAtom);
    const setAccessToken = useSetAtom(accessTokenAtom);
    
    const logout = () => {
        setUser(null);
        setAccessToken(null);
    };

    const USER_MENU = [
        {
            icon: <Image width={24} height={24} src="/setting.svg" alt="환경설정 아이콘" />,
            label: "환경설정",
        },
        {
            icon: <Image width={24} height={24} src="/door-exit.svg" alt="로그아웃 아이콘" />,
            label: "로그아웃",
            onClick: logout
        },
    ];
    
    const { className } = props;

    return (
        <div className={`${style.wrapper} ${className}`}>
            {USER_MENU.map((menu, index) => (
                <UserMenuItem key={index} icon={menu.icon} label={menu.label} onClick={menu.onClick} />
            ))}
        </div>
    );
};

export default UserMenu;
