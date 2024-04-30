import Link from "next/link";
import style from "./roomCard.module.scss";

const RoomCard = () => {
    return (
        <Link href="/">
            <div className={style.container}>
                <div className={style.name_container}>
                    <p className={style.name}>내방이죠 정말로</p>
                </div>
                <span className={style.created_at}>2024.04.20 개설</span>
                <span className={style.button_container}>
                    <button className={style.rename_button} />
                    <button className={style.delete_button} />
                </span>
            </div>
        </Link>
    );
};
export default RoomCard;
