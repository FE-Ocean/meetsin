import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomsController } from "./rooms.controller";
import { Room, RoomSchema } from "./rooms.schema";
import { RoomsService } from "./rooms.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }])],
    controllers: [RoomsController],
    providers: [RoomsService]
})
export class RoomsModule {}
