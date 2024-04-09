import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/auth.guard";
import { CreateRoomDto } from "./dto/create-room.dto";
import { RoomsService } from "./rooms.service";

@Controller("rooms")
@UseGuards(JwtGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    createRoom(@Body("roomData") roomData: CreateRoomDto) {
        return this.roomsService.createRoom(roomData);
    }

    @Get("/:id")
    getRoomById(@Param("id") id: string) {
        return this.roomsService.getRoomById(id);
    }

    // 수정하는건 방이름?...방장?.. 근데 이건 이걸 수정하는 UI?기능?이 정의되면?

    @Delete("/:id")
    deleteRoom(@Param("id") id: string) {
        return this.roomsService.deleteRoom(id);
    }
}
