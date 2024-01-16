import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./google.strategy";
import { AuthController } from "./auth.controller";
import { UsersService } from "src/users/users.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: "1y",
            },
        }),
        forwardRef(() => UsersModule),
        PassportModule.register({session: true}),
    ],
    providers: [AuthService, GoogleStrategy, UsersService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
