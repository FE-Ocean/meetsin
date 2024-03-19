// 뷰 모델
export interface IUser {
    userId: string
    userName: string
    profileImg: string
    email: string
}

// 서버의 응답 모델
export interface IUserModel {
    user_id: string
    user_name: string
    profile_img: string
    email: string
}