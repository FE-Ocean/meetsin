import dotenv from 'dotenv'

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatsModule } from "./chats/chats.module";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import * as mongoose from "mongoose";

dotenv.config()

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        ChatsModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    private readonly isDev: boolean = process.env.MODE === "dev" ? true : false;
    configure(consumer: MiddlewareConsumer) {
        mongoose.set("debug", this.isDev);
        mongoose.connect(process.env.MONGODB_URI)
    }
}
