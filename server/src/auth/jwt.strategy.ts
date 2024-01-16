import { UsersRepository } from 'src/users/users.repository';
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { ExtractJwt } from 'passport-jwt'

export type JwtPayload = {
    sub: string;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersRepository: UsersRepository) {

        const extractJwtFromCookie = (req) => {
            let token = null
            if(req && req.cookies) {
                token = req.cookies['access_token']
            }
            return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req)
        }

        super({
            ignoreExpiration: false,
            secretOrKey: '', // jwt secret
            jwtFromRequest: extractJwtFromCookie
        })
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersRepository.findUserById(payload.sub)
        if(!user) {
            throw new UnauthorizedException('login to continue')
        }

        return {
            user_id: payload.sub,
            email: payload.email
        }
    }
}