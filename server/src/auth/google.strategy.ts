import dotenv from "dotenv";

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { User } from "src/schema/user.schema";
import { AuthService } from "./auth.service";

dotenv.config()

@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/redirect/google",
            scope: ["email", "profile"],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
        console.log(profile)
        const {id, name, emails, photos} = profile;
        const userInfo: User = {
            user_id: emails[0].value,
            email: emails[0].value,
            profile_img: photos[0].value,
            user_name: name.familyName + name.givenName,
            accessToken,
            refreshToken,
        }
        const user = await this.authService.testSignin(userInfo)
        // done(null, user);
        return user;
    }
}