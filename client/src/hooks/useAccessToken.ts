import { useState } from "react";

export const useAccessToken = () => {

    const [accessToken, setAccessToken] = useState("");
    return { accessToken, setAccessToken };
};