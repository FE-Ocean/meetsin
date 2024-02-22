import React from "react";
import style from "./login.module.scss";
import LoginButton from "@/components/button/login/loginButton";
import { SOCIAL_LOGIN } from "@/constants/login.const";
import Image from "next/image";

const Login = () => {
    return (
        <div className={style.login_modal}>
            <h2 className={style.title}>Login</h2>
            <button className={style.close_button}>
                <Image src={"close.svg"} alt="close button" width={24} height={24} />
            </button>
            <ul className={style.button_list}>
                {Object.keys(SOCIAL_LOGIN).map((loginType) => {
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
