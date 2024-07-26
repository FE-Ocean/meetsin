import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { RoomsModule } from "./rooms/rooms.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { PhaserModule } from "./phaser/phaser.module";
import { NotificationModule } from "./notification/notification.module";
import * as mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        AuthModule,
        PhaserModule,
        RoomsModule,
        NotificationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    private readonly isDEV: boolean = process.env.MODE === "DEV";
    configure(consumer: MiddlewareConsumer) {
        mongoose.set("debug", this.isDEV);
        mongoose.connect(process.env.MONGODB_URI);
    }
}
