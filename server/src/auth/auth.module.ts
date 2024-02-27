import { AuthSerializer } from './auth.serializer';
import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";
import { GoogleStrategy } from "./google.strategy";
import { KakaoStrategy } from "./kakao.strategy";
import { AuthController } from "./auth.controller";
import { UsersService } from "src/users/users.service";
import dotenv from "dotenv";

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        forwardRef(() => UsersModule),
    ],
    providers: [AuthService, GoogleStrategy, KakaoStrategy, AuthSerializer, UsersService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}