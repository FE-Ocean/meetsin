import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtGuard } from "src/auth/auth.guard";
import { UsersModule } from "src/users/users.module";
import { RoomsController } from "./rooms.controller";
import { Room, RoomSchema } from "./rooms.schema";
import { RoomsService } from "./rooms.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
        JwtModule,
        UsersModule,
    ],
    controllers: [RoomsController],
    providers: [RoomsService, JwtGuard],
})
export class RoomsModule {}
