"use client";

import React from "react";
import Image from "next/image";
import { socialLogin, socialLoginType } from "@/constants/login.const";
import style from "./login_button.module.scss";
import { signIn } from "next-auth/react";

interface IProps {
    loginType: socialLoginType;
}

const LoginButton = ({ loginType }: IProps) => {
    const login = async (loginType: socialLoginType) => {
        window.location.href = "http://localhost:8000/auth/login/google";
    };

    return (
        <button className={`${style.button} ${style[loginType]}`} onClick={() => login(loginType)}>
            <Image
                src={`/icon/login/${loginType}.svg`}
                className={style.icon}
                alt=""
                width="32"
                height="32"
            />
            <span className={style.text}>{socialLogin[loginType]} 계정으로 로그인</span>
        </button>
    );
};

export default LoginButton;
