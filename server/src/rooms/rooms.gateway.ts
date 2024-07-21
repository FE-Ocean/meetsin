import { Logger } from "@nestjs/common";
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayDisconnect,
    MessageBody,
    WebSocketServer,
} from "@nestjs/websockets";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { RoomsService } from "src/rooms/rooms.service";
import { MessageInfoDTO } from "./dto/messageInfo.dto";
import { TimerDto } from "./dto/timer.dto";

interface UserSocket extends Socket {
    user?: any;
}

interface ITimer {
    roomId: string;
    duration: TimerDto;
}

@WebSocketGateway({
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
    namespace: "chat",
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    private logger = new Logger("chat");

    constructor(private readonly roomsService: RoomsService) {}

    @WebSocketServer() server: Server;

    afterInit(server: any) {
        this.logger.log("init");
    }

    handleConnection(@ConnectedSocket() socket: UserSocket) {
        this.logger.log(`connect ${socket.id} ${socket.nsp.name}`);
    }

    handleDisconnect(client: any) {
        this.logger.log("disconnect");
    }

    @SubscribeMessage("join_room")
    handleJoin(
        @MessageBody() data: { roomId: string; userId: Types.ObjectId },
        @ConnectedSocket() socket: Socket,
    ) {
        const { roomId, userId } = data;

        socket.join(roomId);
        this.roomsService.addUserToRoom(roomId, userId);
    }

    @SubscribeMessage("leave_room")
    handleLeave(
        @MessageBody() data: { roomId: string; userId: Types.ObjectId },
        @ConnectedSocket() socket: Socket,
    ) {
        const { roomId, userId } = data;

        socket.leave(roomId);
        this.roomsService.removeUserFromRoom(roomId, userId);
    }

    @SubscribeMessage("new_message")
    handleMessage(@MessageBody() messageInfo: MessageInfoDTO): void {
        this.server
            .to(messageInfo.roomId)
            .emit("new_message", { time: new Date(), ...messageInfo });
    }

    @SubscribeMessage("start_timer")
    handleStartTimer(@MessageBody() data: ITimer) {
        const { roomId, duration } = data;

        this.server.to(roomId).emit("start_timer", duration);
        // this.server.in(roomId).emit("start_timer", duration); // 방장 포함
    }

    @SubscribeMessage("stop_timer")
    handleStopTimer(@MessageBody() roomId: string) {
        this.server.to(roomId).emit("stop_timer");
        // this.server.in(roomId).emit("start_timer"); // 방장 포함
    }
}
