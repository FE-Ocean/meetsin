import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import dotenv from "dotenv";

dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/redirect/google`,
            scope: ["email", "profile"],
        });
    }

    authorizationParams(options: any): object {
        return {
            access_type: "offline",
        };
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        // done: (error: Error, signUser?) => void,
        done: VerifyCallback,
    ) {
        try {
            const { emails, photos, displayName } = profile;

            const userInfo = {
                email: emails[0].value,
                profile_img: photos[0].value,
                user_name: displayName,
                access_token: accessToken,
                refresh_token: refreshToken,
                provider: "google",
            };
            done(null, userInfo);
        } catch (error) {
            done(error);
        }
    }
}
