import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Room } from "./schemas/rooms.schema";
import { User } from "src/modules/users/schemas/user.schema";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UsersRepository } from "src/modules/users/users.repository";

@Injectable()
export class RoomsService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<Room>,
        private readonly userRepository: UsersRepository,
    ) {}

    createRoom(roomData: CreateRoomDto, user: User) {
        const newRoom = new this.roomModel({ room_name: roomData.roomName, admin: user.id });
        return newRoom.save();
    }

    async getRoomsByUserId(userId: Types.ObjectId) {
        const rooms = await this.roomModel.find({ admin: userId });

        if (!rooms) {
            throw new NotFoundException(`사용자 아이디(${userId})를 찾을 수 없습니다.`);
        }
        return rooms;
    }

    async getRoomById(roomId: Types.ObjectId) {
        const room = await this.roomModel.findById(roomId).exec();

        if (!room) {
            throw new NotFoundException(`방 (${roomId})을 찾을 수 없습니다.`);
        }
        return room;
    }

    async updateRoom(roomId: Types.ObjectId, roomName: string) {
        const room = await this.getRoomById(roomId);
        room.room_name = roomName;

        return await room.save();
    }

    async getRoomUserSubscriptions(userIds: string[]) {
        const users = await Promise.all(
            userIds.map((userId) => this.userRepository.findUserById(userId)),
        );

        const subscriptions = users
            .filter((user) => user.notification !== undefined)
            .flatMap((user) => user.notification!);
        return subscriptions;
    }

    async deleteRoom(roomId: Types.ObjectId) {
        const room = await this.getRoomById(roomId);

        return await room.deleteOne();
    }
}
