"use client";

import React from "react";
import Image from "next/image";
import { socialLogin, socialLoginType } from "@/constants/login.const";
// import style from "./login_button.module.scss";
import Link from "next/link";

interface IProps {
    loginType: socialLoginType;
}

const LoginButton = ({ loginType }: IProps) => {
    const login = async (loginType: socialLoginType) => {
        // TODO: axios or react-query 사용하여 한 번 래핑
        // TODO: 서버 url 환경변수로 분리
        // const test = await fetch("http://localhost:8000/auth/login/google", {
        //     credentials: "include",
        // });
        // console.log(test);
        window.location.href = "http://localhost:8000/auth/login/google";
        return;
    };

    return (
        // className={`${style.button} ${style[loginType]}`}
        <button onClick={login}>
            {/* 
                className={style.icon} */}
            <Image src={`/icon/login/${loginType}.svg`} alt="" width="32" height="32" />
            {/*  className={style.text} */}
            <span>{socialLogin[loginType]} 계정으로 로그인</span>
        </button>
    );
};

export default LoginButton;
