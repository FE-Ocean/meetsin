import style from "./menu.module.scss";

const Menu = () => {
    return (
        <div className={style.menu_container}>
            <ul className={style.menu_bar}>
                <li>
                    <button
                        className={style.timer}
                        aria-label="타이머 설정하기"
                    ></button>
                </li>
                <li>
                    <button
                        className={style.screenshare}
                        aria-label="화면 공유하기"
                    ></button>
                </li>
                <li className={style.active_number}>
                    <img src="/ghost.svg" alt="접속자 수" />
                    <span className={style.active_circle}>●</span>
                    <span>2</span>
                </li>
            </ul>
            <button className={style.chat} />
        </div>
    );
};
export default Menu;
