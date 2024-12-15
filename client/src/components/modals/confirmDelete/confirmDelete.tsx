import { useAtomValue } from "jotai";
import { roomIdAtom } from "@/jotai/atom";
import { useDeleteRoom } from "@/apis/service/room.service";
import { BaseModal } from "@/components/modal/baseModal/baseModal";
import Button from "@/components/common/button/button";
import style from "./confirmDelete.module.scss";

const ConfirmDelete = ({ onClose }: { onClose: () => void }) => {
    const roomId = useAtomValue(roomIdAtom);

    const { mutate } = useDeleteRoom(roomId);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate();
        onClose();
    };

    return (
        <BaseModal onClose={onClose}>
            <form onSubmit={handleSubmit} className={style.modal_container}>
                <button type="button" onClick={onClose} className={style.close_icon} />
                <h2 className={style.title}>정말 삭제할까요?</h2>
                <div className={style.buttons}>
                    <Button type="button" onClick={onClose} look="ghost" width={90} text="닫기" />
                    <Button type="submit" look="solid" width={90} text="삭제하기" />
                </div>
            </form>
        </BaseModal>
    );
};
export default ConfirmDelete;
