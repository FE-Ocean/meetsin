import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "@/jotai/atom";
import { BaseModal } from "@/components/modal/baseModal/baseModal";
import { useCreateRoom } from "@/app/api/service/room.service";
import useModal from "@/hooks/useModal";
import Button from "@/components/common/button/button";
import style from "./createRoom.module.scss";

const CreateRoom = () => {
    const { onClose } = useModal("createRoom");

    const roomNameRef = useRef<HTMLInputElement>({} as HTMLInputElement);
    const accessToken = useAtomValue(accessTokenAtom);
    const router = useRouter();

    const { mutate } = useCreateRoom();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate(
            { roomNameInput: roomNameRef.current.value, accessToken },
            {
                onSuccess: (data) => {
                    onClose();
                    router.push(`/room/${data?.roomId}`);
                },
            },
        );
    };

    return (
        <BaseModal onClose={onClose}>
            <form onSubmit={handleSubmit} className={style.modal_container}>
                <button type="button" onClick={onClose} className={style.close_icon} />
                <h2 className={style.title}>Create Room</h2>
                <input
                    type="text"
                    maxLength={20}
                    className={style.room_name}
                    ref={roomNameRef}
                    placeholder="방 이름을 입력하세요 (최대 20자)"
                />
                <div className={style.buttons}>
                    <Button type="button" onClick={onClose} look="ghost" width={100} text="닫기" />
                    <Button type="submit" look="solid" width={100} text="만들기" />
                </div>
            </form>
        </BaseModal>
    );
};
export default CreateRoom;
