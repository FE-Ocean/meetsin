import style from "./userMenuItem.module.scss";

interface IUserMenuItem {
    icon: React.ReactNode;
    label: string;
    onClick?: (...params:any) => any
}

const UserMenuItem = (props: IUserMenuItem) => {
    const { icon, label, onClick } = props;

    return (
        <div className={style.wrapper} onClick={onClick}>
            {icon}
            <span className={style.label}>{label}</span>
        </div>
    );
};

export default UserMenuItem;
