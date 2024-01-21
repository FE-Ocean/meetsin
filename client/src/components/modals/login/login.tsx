import React from "react";
import style from "./login.module.scss";
import LoginButton from "@/components/button/login/LoginButton";
import { socialLogin } from "@/constants/login.const";
import Image from "next/image";

const Login = () => {
    return (
        <div className={style.login_modal}>
            <h2 className={style.title}>Login</h2>
            <button className={style.close_button}>
                <Image src={"close.svg"} width={24} height={24} />
            </button>
            <ul className={style.button_list}>
                {Object.keys(socialLogin).map((loginType) => {
                    return (
                        <li key={loginType}>
                            <LoginButton loginType={loginType} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Login;
