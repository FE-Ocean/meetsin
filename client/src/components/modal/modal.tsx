"use client";

import style from "./modal.module.scss";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAtom } from "jotai";
import { modalAtom } from "@/jotai/atom";

const Modal = () => {

    const [mounted, setMounted] = useState(false);
    const [modal, setModal] = useAtom(modalAtom);

    const containerRef = useRef(null);

    const handleModalClose = () => {
        setModal({
            open : false,
            content : null
        });
    };

    const handleKeyDown = (e : KeyboardEvent) => {
        const { key } = e;
        if (key === "Escape") {
            handleModalClose();
        }
    };

    const handleClick = (e : React.MouseEvent<HTMLDivElement>) => {
        const { target } = e;
        if (target === containerRef.current) {
            handleModalClose();
        }
    };

    useEffect(() => {
        setMounted(true);
    },[]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return mounted && modal.open ? (
        <>
            {createPortal(
                <div className={style.modal_container} ref={containerRef} onClick={handleClick}>
                    <div className={style.modal_content_wrapper}>
                        {modal.content}
                    </div>
                </div>, 
                document.body
            )}
        </>
    ) : (
        null
    );

};

export default Modal;