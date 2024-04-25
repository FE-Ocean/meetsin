import { BaseModal } from "@/components/modal/baseModal/baseModal";
import Button from "@/components/common/button/button";
import style from "./confirmDelete.module.scss";

interface IModal {
    onClose: () => void;
}

const ConfirmDelete = ({ onClose }: IModal) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //삭제 api~
        // onClose();
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
