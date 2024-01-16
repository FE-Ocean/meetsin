"use client";
import { useEffect } from "react";
import style from "./style.module.scss";
import Login from "@/components/modals/login/login";
import LoginButton from "@/components/button/login/LoginButton";

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
            <button>임시 로그인 버튼 추가 예정</button>
            <LoginButton loginType="google" />
        </>
    );
};
export default Home;
