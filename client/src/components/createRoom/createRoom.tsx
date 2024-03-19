import { useRef } from "react";
import Button from "@/components/common/button/button";
import style from "./createRoom.module.scss";

interface ICreateRoomProps {
    setCreateRoomVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateRoom = ({ setCreateRoomVisible }: ICreateRoomProps) => {
    const roomNameRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className={style.modal_container}>
            <button
                type="button"
                className={style.close_icon}
                onClick={() => setCreateRoomVisible(false)}
            />
            <h2 className={style.title}>Create Room</h2>
            <input
                type="text"
                maxLength={10}
                className={style.room_name}
                ref={roomNameRef}
                placeholder="방 이름을 입력하세요"
            />
            <div className={style.buttons}>
                <Button
                    type="button"
                    look="ghost"
                    width={100}
                    text="닫기"
                    onClick={() => setCreateRoomVisible(false)}
                />
                <Button type="submit" look="solid" width={100} text="만들기" />
            </div>
        </form>
    );
};
export default CreateRoom;
