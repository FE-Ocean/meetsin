import { cookies } from "next/headers";

export const getToken = () => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    return accessToken;
};
