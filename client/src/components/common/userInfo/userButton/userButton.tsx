import ProfileImage from "@/components/common/profileImage/profileImage";
import style from "./userButton.module.scss";
import { useAtomValue } from "jotai";
import { userAtom } from "@/jotai/atom";

interface IUserButton {
    onClick?: () => void;
}

const UserInfoButton = (props: IUserButton) => {
    const { onClick } = props;

    const user = useAtomValue(userAtom);

    return (
        user && <button className={style.user_info_button} onClick={onClick}>
            <ProfileImage src={user.profileImg} />
            <span className={style.user_name}>{user.userName}</span>
        </button>
    );
};

export default UserInfoButton;
