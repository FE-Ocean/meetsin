import React from "react";
import Image from "next/image";
import style from "./profileImage.module.scss";
import { imageSizeType } from "@/constants/ImageSize.type";

interface IProps {
    src: string;
    alt?: string;
    size?: imageSizeType;
}

const ProfileImage = ({ src, alt, size }: IProps) => {
    if (!size) {
        size = imageSizeType.middle;
    }
    // TODO: src = "" 이면 기본 이미지 추가
    return <Image src={src} alt={alt || ""} className={style.profile} width={size} height={size} />;
};

export default ProfileImage;
