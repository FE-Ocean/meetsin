import { baseClient } from "../../../modules/fetchClient";

export const getUserInfo = async (accessToken: string) => {
    if(!accessToken){
        return;
    }
    return await baseClient.get("/auth/user", {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
};
