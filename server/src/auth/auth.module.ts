import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";
import { GoogleStrategy } from "./google.strategy";
import { KakaoStrategy } from "./kakao.strategy";
import { AuthController } from "./auth.controller";
import dotenv from "dotenv";
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        forwardRef(() => UsersModule),
        PassportModule.register({
            defaultStrategy: 'jwt',
            session: false,
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '30d',
            }
        })
    ],
    providers: [AuthService, GoogleStrategy, KakaoStrategy, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}