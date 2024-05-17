import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity } from "src/schema/user.schema";
import { Room } from "./rooms.schema";
import { CreateRoomDto } from "./dto/create-room.dto";


@Injectable()
export class RoomsService {
    constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

    createRoom(roomData: CreateRoomDto, user: UserEntity) {
        const newRoom = new this.roomModel({ room_name: roomData.roomName, admin: user.user_id });
        return newRoom.save();
    }

    async getRoomsByUserId(userId: string) {
        const rooms = await this.roomModel.find({ admin: userId }).exec();

        if (!rooms) {
            throw new NotFoundException(`사용자 아이디(${userId})를 찾을 수 없습니다.`);
        }
        return rooms;
    }

    async getRoomById(roomId: string) {
        const room = await this.roomModel.findById(roomId).exec();

        if (!room) {
            throw new NotFoundException(`방 (${roomId})을 찾을 수 없습니다.`);
        }
        return room;
    }

    async updateRoom(roomId: string, roomName: string) {
        const room = await this.getRoomById(roomId);
        room.room_name = roomName;

        return await room.save();
    }

    async deleteRoom(roomId: string) {
        const room = await this.getRoomById(roomId);

        return await room.deleteOne();
    }
}