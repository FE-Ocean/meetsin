import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-kakao";

export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
    constructor() {
        super({
            clientID: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/redirect/kakao`,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        // done: (error: Error, signUser?) => void,
        done: (error: Error, user?: Express.User) => void,
    ) {
        try {
            const { _json: json, displayName } = profile;

            const userInfo = {
                email: json.kakao_account.email,
                profile_img: json.kakao_account.profile.profile_image_url,
                user_name: displayName,
                access_token: accessToken,
                refresh_token: refreshToken,
                provider: "kakao",
            };

            done(null, userInfo);
        } catch (error) {
            done(error);
        }
    }
}
