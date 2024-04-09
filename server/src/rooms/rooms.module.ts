import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { RoomsController } from "./rooms.controller";
import { Room, RoomSchema } from "./rooms.schema";
import { RoomsService } from "./rooms.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]), AuthModule],
    controllers: [RoomsController],
    providers: [RoomsService, JwtService],
})
export class RoomsModule {}
