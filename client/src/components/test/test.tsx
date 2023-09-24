"use client";

import { modalAtom } from "@/jotai/atom";
import { useSetAtom } from "jotai";

export default function ModalTestComponent () {

    const setModal = useSetAtom(modalAtom);

    const handleClick = () => {
        setModal({
            open : true,
            content : <div style={{ background : "lightblue", padding : "30px" }}>모달안에 들어갈 컴포넌트</div>
        });
    };

    return (
        <div style={{ position : "absolute", top : "10px", right : "10px" }}>
            <button onClick={handleClick}>모달생성</button>
        </div>
    );
}