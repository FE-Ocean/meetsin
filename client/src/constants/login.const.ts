export const socialLogin: { [key: string]: string } = {
    google: "구글",
    // naver: "네이버",
    kakao: "카카오",
};

export type socialLoginType = (typeof socialLogin)[keyof typeof socialLogin];
