"use client";
import { useEffect, useState } from "react";
import style from "./style.module.scss";
import Button from "@/components/common/button/button";
import { baseClient } from "@/modules/fetchClient";
import { userAtom } from "@/jotai/atom";
import { useAtom } from "jotai";
import { IUser, IUserModel } from "@/types/user.type";
import useModal from "@/hooks/useModal";
import UserInfo from "@/components/common/userInfo/userInfo";

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

    const [accessToken, setAccessToken] = useState("");
    
    const [user, setUser] = useAtom(userAtom);

    useEffect(() => {
        const token = document.cookie.split("; ").find(cookie => cookie.includes("access_token="))?.replace("access_token=", "");
        if(token){
            setAccessToken(token);
        }
        // console.log(document.cookie);
    
        const getUserInfo = async () => {
            if(!accessToken){
                return;
            }
            // 토큰이 있으면 다시 로그인 요청하는 api 호출?
            const data = await baseClient.get("/auth/user", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then(res => {
                const userData = res as IUserModel;
                return {
                    userName: userData.user_name,
                    userId: userData.user_id,
                    profileImg: userData.profile_img,
                    email: userData.email
                } as IUser;
            });

            setUser(data);
        };

        getUserInfo();
    }, [accessToken, setAccessToken, setUser]);
    
    const { onOpen } = useModal("login");

    return (
        <div className={style.home_wrapper}>
            {
                user 
                    ?
                    <>
                        <UserInfo className={style.user_info} /> 
                        <div className={style.make_room_wrapper}>
                            <p className={style.make_room_description}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa, dolore asperiores repudiandae tempore quisquam doloremque. Laborum hic necessitatibus impedit molestias reiciendis, provident officiis quod quas labore? Dicta quam dignissimos deserunt?</p>
                            <Button type="button" look="solid" text="방 만들기" width={135} />
                        </div>
                    </> 
                    :
                    <Button type="button" look="solid" text="Get Started" width={143} onClick={onOpen} />
            }
        </div>
    );
};
export default Home;
