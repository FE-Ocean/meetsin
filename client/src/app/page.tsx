"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { accessTokenAtom, userAtom } from "@/jotai/atom";
import Button from "@/components/common/button/button";
import useModal from "@/hooks/useModal";
import { useGetUserInfo } from "./api/service/user.service";
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

    // const [accessToken, setAccessToken] = useAtom(accessTokenAtom);

    // const [user, setUser] = useAtom(userAtom);

    // useEffect(() => {
    //     if (!user) {
    //         const token = document.cookie
    //             .split("; ")
    //             .find((cookie) => cookie.includes("access_token="))
    //             ?.replace("access_token=", "");
    //         if (token) {
    //             setAccessToken(token);
    //         } else {
    //             setAccessToken("");
    //         }
    //     }
    // }, [user, accessToken, setAccessToken]);

    // const isEnable = !!accessToken;

    // const { data } = useGetUserInfo();

    // useEffect(() => {
    //     if (data) {
    //         setUser(data);
    //     }
    // }, [data, setUser]);

    const { onOpen } = useModal("login");

    // const router = useRouter();

    // useEffect(() => {
    //     if (user && accessToken) {
    //         router.push("/lobby");
    //     }
    // }, [user, accessToken, router]);

    return (
        <div className={style.home_wrapper}>
            <Button type="button" look="solid" text="Get Started" width={143} onClick={onOpen} />
        </div>
    );
};
export default Home;
