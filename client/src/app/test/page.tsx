import ProfileImage from "@/components/common/profile_image/ProfileImage";
import { imageSizeType } from "@/constants/ImageSize.type";
import React from "react";

function page() {
    return <ProfileImage src="https://picsum.photos/id/237/200/300" size={imageSizeType.large} />;
}

export default page;
