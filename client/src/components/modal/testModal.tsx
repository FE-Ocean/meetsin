"use client";
import React from "react";
import { createPortal } from "react-dom";
import style from "./test_modal.module.scss";
import { showModalAtom } from "@/store/store";
import { useAtom } from "jotai";

const TestModal = ({ children }) => {
    const [isShowModal, setShowModal] = useAtom(showModalAtom);

    return (
        isShowModal &&
        children &&
        createPortal(
            <div
                className={style.modal_background}
                onClick={() => {
                    setShowModal(!isShowModal);
                }}
            >
                {React.cloneElement(children, {
                    onClick: (event: Event) => {
                        event.stopPropagation();
                    },
                })}
            </div>,
            document.body,
        )
    );
};

export default TestModal;
