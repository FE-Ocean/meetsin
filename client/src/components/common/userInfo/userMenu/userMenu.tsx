import Image from "next/image";
import UserMenuItem from "../userMenuItem/userMenuItem";
import style from "./userMenu.module.scss";
import { useRouter } from "next/navigation";

interface IUserMenu {
    className?: string;
}

const UserMenu = (props: IUserMenu) => {
    const router = useRouter();
    const logout = () => {
        document.cookie = document.cookie
            .split("; ")
            .map((cookie) => {
                if (cookie.includes("access_token=")) {
                    return cookie + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                } else {
                    return cookie;
                }
            })
            .join("; ");

        router.push("/");
    };

    const USER_MENU = [
        {
            icon: <Image width={24} height={24} src="/icons/setting.svg" alt="환경설정 아이콘" />,
            label: "환경설정",
        },
        {
            icon: <Image width={24} height={24} src="/icons/door_exit.svg" alt="로그아웃 아이콘" />,
            label: "로그아웃",
            onClick: logout,
        },
    ];

    const { className } = props;

    return (
        <div className={`${style.wrapper} ${className}`}>
            {USER_MENU.map((menu, index) => (
                <UserMenuItem
                    key={index}
                    icon={menu.icon}
                    label={menu.label}
                    onClick={menu.onClick}
                />
            ))}
        </div>
    );
};

export default UserMenu;
