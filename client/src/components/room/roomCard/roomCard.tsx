import Link from "next/link";
import { IRoom } from "@/types/room";
import style from "./roomCard.module.scss";

const RoomCard = ({ room }: { room: IRoom }) => {
    const { room_name, created_at } = room;
    const created = created_at ? created_at.slice(0, 10) + " 개설" : "여긴 없음"; // 현재 DB 내 옛 데이터들 때문에 "여긴 없음" 표시함 지울 예정

    return (
        <Link href="/">
            <div className={style.container}>
                <div className={style.name_container}>
                    <p className={style.name}>{room_name}</p>
                </div>
                <span className={style.created_at}>{created}</span>
                <span className={style.button_container}>
                    <button className={style.rename_button} />
                    <button className={style.delete_button} />
                </span>
            </div>
        </Link>
    );
};
export default RoomCard;
