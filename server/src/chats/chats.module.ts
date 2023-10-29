import { Module } from "@nestjs/common";
import { ChatsGateway } from "./chats.gateway";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

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
    ],
    providers: [ChatsGateway],
})
export class ChatsModule {}
