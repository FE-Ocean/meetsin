import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomsModule } from "../rooms/rooms.module";
import { User, UserSchema } from "src/modules/users/schemas/user.schema";
import { UsersModule } from "src/modules/users/users.module";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UsersModule,
        JwtModule,
        RoomsModule,
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
})
export class NotificationModule {}
