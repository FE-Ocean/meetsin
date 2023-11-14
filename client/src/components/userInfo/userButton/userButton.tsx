import style from "./userButton.module.scss";

interface IUserButton {
    onClick?: () => void;
}

const UserInfoButton = (props: IUserButton) => {
    const { onClick } = props;

    return (
        <button className={style.user_info_button} onClick={onClick}>
            <div className={style.user_img} />
            <span className={style.user_name}>사용자닉네임열글자임</span>
        </button>
    );
};

export default UserInfoButton;
