import style from "./userMenuItem.module.scss";

interface IUserMenuItem {
    icon: React.ReactNode;
    label: string;
}

const UserMenuItem = (props: IUserMenuItem) => {
    const { icon, label } = props;

    return (
        <div className={style.wrapper}>
            {icon}
            <span className={style.label}>{label}</span>
        </div>
    );
};

export default UserMenuItem;
