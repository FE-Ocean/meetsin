import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { JwtGuard } from "src/common/guards/auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { User } from "src/modules/users/schemas/user.schema";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { RoomsService } from "./rooms.service";

@Controller("rooms")
@UseGuards(JwtGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    createRoom(@Body("roomData") roomData: CreateRoomDto, @CurrentUser() user: User) {
        return this.roomsService.createRoom(roomData, user);
    }

    @Get("/user")
    getRoomsByUserId(@CurrentUser() user: User) {
        return this.roomsService.getRoomsByUserId(user.id);
    }

    @Get("/:roomId")
    getRoomById(@Param("roomId") roomId: Types.ObjectId) {
        return this.roomsService.getRoomById(roomId);
    }

    @Patch("/:roomId")
    updateRoom(@Param("roomId") roomId: Types.ObjectId, @Body("roomData") roomData: UpdateRoomDto) {
        return this.roomsService.updateRoom(roomId, roomData.roomName);
    }

    @Delete("/:roomId")
    deleteRoom(@Param("roomId") roomId: Types.ObjectId) {
        return this.roomsService.deleteRoom(roomId);
    }
}
