import { baseClient, createAuthHeader } from "@/modules/fetchClient";

export const getUserInfo = async (accessToken?: string) => {
    const headers = createAuthHeader(accessToken);

    return await baseClient.get("/auth/user", {
        headers,
    });
};
