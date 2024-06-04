import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatsModule } from "./chats/chats.module";
import { AuthModule } from "./auth/auth.module";
import { RoomsModule } from "./rooms/rooms.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { PhaserModule } from './phaser/phaser.module';
import * as mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        ChatsModule,
        AuthModule,
        PhaserModule,
        RoomsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    private readonly isDev: boolean = process.env.MODE === "dev" ? true : false;
    configure(consumer: MiddlewareConsumer) {
        mongoose.set("debug", this.isDev);
        mongoose.connect(process.env.MONGODB_URI);
    }
}
