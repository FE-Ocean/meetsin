import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Room } from "./rooms.schema";
import { User } from "src/schema/user.schema";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UsersRepository } from "src/users/users.repository";

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

    async addUserToRoom(roomId: string, newUserId: Types.ObjectId) {
        const newUserData = await this.userRepository.findUserById(newUserId);

        const updatedRoom = await this.roomModel.updateOne(
            { _id: roomId },
            { $addToSet: { userIds: newUserData } },
        );

        if (!updatedRoom) {
            throw new Error("Room에 사용자가 추가되지 않았습니다.");
        }

        return updatedRoom;
    }

    async removeUserFromRoom(roomId: string, removeUserId: Types.ObjectId) {
        const updatedRoom = await this.roomModel
            .findOneAndUpdate({ _id: roomId }, { $pull: { userIds: removeUserId } }, { new: true })
            .exec();

        if (!updatedRoom) {
            throw new Error("Room에 사용자가 제거되지 않았습니다.");
        }

        return updatedRoom;
    }

    async deleteRoom(roomId: string) {
        const room = await this.getRoomById(roomId);

        return await room.deleteOne();
    }
}
