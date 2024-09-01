"use client";
import { useEffect } from "react";
import Button from "@/components/common/button/button";
import useModal from "@/hooks/useModal";
import style from "./style.module.scss";

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

    const { onOpen } = useModal("login");

    return (
        <div className={style.home_wrapper}>
            <Button type="button" look="solid" text="Get Started" width={143} onClick={onOpen} />
        </div>
    );
};
export default Home;
