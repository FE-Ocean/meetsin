import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { UserEntity } from "src/schema/user.schema";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { RoomsService } from "./rooms.service";

@Controller("rooms")
@UseGuards(JwtGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    createRoom(@Body("roomData") roomData: CreateRoomDto, @CurrentUser() user: UserEntity) {
        return this.roomsService.createRoom(roomData, user);
    }

    @Get("user")
    getRoomsByUserId(@CurrentUser() user: UserEntity) {
        return this.roomsService.getRoomsByUserId(user.id);
    }

    @Get(":roomId")
    getRoomById(@Param("roomId") roomId: string) {
        return this.roomsService.getRoomById(roomId);
    }

    @Patch(":roomId")
    updateRoom(@Param("roomId") roomId: string, @Body("roomData") roomData: UpdateRoomDto) {
        return this.roomsService.updateRoom(roomId, roomData.roomName);
    }

    @Delete(":roomId")
    deleteRoom(@Param("roomId") roomId: string) {
        return this.roomsService.deleteRoom(roomId);
    }
}
