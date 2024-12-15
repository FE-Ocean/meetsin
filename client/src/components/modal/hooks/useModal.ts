import { modalAtom } from "@/jotai/atom";
import { useSetAtom } from "jotai";
import { useCallback } from "react";

const useModal = (modalFileName: string) => {
    const setModalState = useSetAtom(modalAtom);

    const toggleModal = useCallback(
        (isOpen: boolean) => {
            setModalState((prev) => ({
                ...prev,
                [modalFileName]: { ...prev[modalFileName], open: isOpen },
            }));
        },
        [modalFileName],
    );

    const onOpen = () => toggleModal(true);

    const onClose = () => toggleModal(false);

    return { onOpen, onClose };
};

export default useModal;
