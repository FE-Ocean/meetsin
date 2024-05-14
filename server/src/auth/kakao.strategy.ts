import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-kakao";
import { Types } from "mongoose";
import { UserEntity } from "src/schema/user.schema";

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
        done: (error: Error, user?: UserEntity) => void,
    ) {
        try {
            const { id, _json: json, displayName } = profile;
            const objectId = new Types.ObjectId();

            const userInfo: UserEntity = {
                _id: objectId,
                user_id: id,
                email: json.kakao_account.email,
                profile_img: json.kakao_account.profile.profile_image_url,
                user_name: displayName,
                access_token: accessToken,
                refresh_token: refreshToken,
            };
            done(null, userInfo);
        } catch (error) {
            done(error);
        }
    }
}
