"use client";
import { useEffect } from "react";
import style from "./style.module.scss";
import Login from "@/components/modals/login/login";

const Home = () => {
    useEffect(() => {
        const registerServiceWorker = async () => {
            if (!("serviceWorker" in navigator)) {
                alert("이 브라우저는 서비스 워커 제공 X");
                return;
            }

            await navigator.serviceWorker.register("/serviceWorker.js");
        };
        registerServiceWorker();
    }, []);

    return (
        <>
            {/* TODO: 모달 toggle 버튼 및 state 추가 */}
            <Login />
        </>
    );
};
export default Home;
