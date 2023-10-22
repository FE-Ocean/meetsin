"use client";

import useModal from "@/hooks/useModal";

export default function ModalTestComponent() {
    const { onOpen, onClose } = useModal("testModal");

    const handleClick = () => {
        onOpen();
    };

    return (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <button onClick={handleClick}>모달생성</button>
        </div>
    );
}
