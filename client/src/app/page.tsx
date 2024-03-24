"use client";
import { useEffect } from "react";
import style from "./style.module.scss";
import Button from "@/components/common/button/button";
import { accessTokenAtom, userAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import useModal from "@/hooks/useModal";
import UserInfo from "@/components/common/userInfo/userInfo";
import { useGetUserInfo } from "./api/service/user.service";
import { useRouter } from "next/navigation";

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

    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    
    const [user, setUser] = useAtom(userAtom);

    useEffect(() => {
        if(!user) {
            const token = document.cookie.split("; ").find(cookie => cookie.includes("access_token="))?.replace("access_token=", "");
            if(token){
                setAccessToken(token);
            }
            else {
                setAccessToken("");
            }
        }
    }, [user, accessToken, setAccessToken]);

    const isEnable = !!accessToken;
    
    const { data } = useGetUserInfo(accessToken, isEnable);
    useEffect(() => {
        if(data) {
            setUser(data);
        }
    }, [data, setUser]);
    const { onOpen } = useModal("login");
    const router = useRouter();

    return (
        <div className={style.home_wrapper}>
            {
                (user && accessToken)
                    ?
                    <>
                        <UserInfo className={style.user_info} direction="bottom" /> 
                        <div className={style.make_room_wrapper}>
                            <p className={style.make_room_description}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa, dolore asperiores repudiandae tempore quisquam doloremque. Laborum hic necessitatibus impedit molestias reiciendis, provident officiis quod quas labore? Dicta quam dignissimos deserunt?</p>
                            <Button type="button" look="solid" text="방 만들기" width={135} />
                            <Button type="button" look="solid" text="(임시) 방 페이지 이동 버튼" width={200} onClick={() => router.push("/room/1")} />
                        </div>
                    </> 
                    :
                    <Button type="button" look="solid" text="Get Started" width={143} onClick={onOpen} />
            }
        </div>
    );
};
export default Home;
