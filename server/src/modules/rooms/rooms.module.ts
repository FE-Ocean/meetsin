import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "src/modules/users/users.module";
import { RoomsController } from "./rooms.controller";
import { RoomsGateway } from "./rooms.gateway";
import { Room, RoomSchema } from "./schemas/rooms.schema";
import { RoomsService } from "./rooms.service";
import { JwtGuard } from "src/common/guards/auth.guard";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
        JwtModule,
        UsersModule,
    ],
    controllers: [RoomsController],
    providers: [RoomsService, JwtGuard, RoomsGateway],
    exports: [RoomsService],
})
export class RoomsModule {}
