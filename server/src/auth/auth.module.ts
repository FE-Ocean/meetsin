import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";

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
    ],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
