import ProfileImage from "@/components/common/profile_image/ProfileImage";
import UserInfo from "@/components/userInfo/userInfo";
import { imageSizeType } from "@/constants/ImageSize.type";
import React from "react";
import style from "./style.module.scss";

function page() {
    return (
        <>
            <ProfileImage src="https://picsum.photos/id/237/200/300" size={imageSizeType.large} />
            <UserInfo direction="bottom" />
            <input type="text" className={style.input} placeholder="메세지를 입력하세요" />
        </>
    );
}

export default page;
