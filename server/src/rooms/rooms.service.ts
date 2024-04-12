import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity } from "src/schema/user.schema";
import { CreateRoomDto } from "./dto/create-room.dto";
import { Room } from "./rooms.schema";

@Injectable()
export class RoomsService {
    constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

    createRoom(roomData: CreateRoomDto, user: UserEntity) {
        const newRoom = new this.roomModel({ room_name: roomData.roomName, admin: user.user_id });
        return newRoom.save();
    }

    async getRoomById(roomId: string) {
        const room = await this.roomModel.findById(roomId).exec();

        if (!room) {
            throw new NotFoundException(`아이디(${roomId})를 찾을 수 없습니다.`);
        }
        return room;
    }

    async deleteRoom(roomId: string) {
        const room = await this.roomModel.findByIdAndRemove(roomId);

        if (!room) {
            throw new NotFoundException(`아이디(${roomId})를 찾을 수 없습니다.`);
        }
        return room;
    }
}
