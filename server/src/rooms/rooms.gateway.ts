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
import { Server, Socket } from "socket.io";
import { RoomsService } from "src/rooms/rooms.service";
import { MessageInfoDTO } from "./dto/messageInfo.dto";
import { TimerDto } from "./dto/timer.dto";

interface UserSocket extends Socket {
    user?: any;
}

interface User {
    socketId: string;
    userId: string;
    userName: string;
}

interface ITimer {
    roomId: string;
    duration: TimerDto;
}

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
    namespace: "room",
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    private logger = new Logger("room");
    private rooms: Map<string, User[]> = new Map();

    constructor(private readonly roomsService: RoomsService) {}

    @WebSocketServer() server: Server;

    afterInit(server: any) {
        this.logger.log("init");
    }

    handleConnection(@ConnectedSocket() socket: UserSocket) {
        this.logger.log(`connect ${socket.id} ${socket.nsp.name}`);
    }

    handleDisconnect(@ConnectedSocket() socket) {
        this.logger.log("disconnect", socket.id);
    }

    @SubscribeMessage("join_room")
    handleJoin(
        @MessageBody() data: { roomId: string; userId: string; userName: string },
        @ConnectedSocket() socket: Socket,
    ) {
        const { roomId, userId, userName } = data;

        socket.join(roomId);
        this.roomsService.addUserToRoom(roomId, userId);

        const user: User = { socketId: socket.id, userId, userName };
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, []);
        }
        this.rooms.get(roomId).push(user);

        this.server.to(roomId).emit("room_users", this.rooms.get(roomId));
    }

    @SubscribeMessage("leave_room")
    handleLeave(
        @MessageBody() data: { roomId: string; userId: string },
        @ConnectedSocket() socket: Socket,
    ) {
        const { roomId, userId } = data;

        socket.leave(roomId);
        this.roomsService.removeUserFromRoom(roomId, userId);

        if (this.rooms.has(roomId)) {
            const users = this.rooms.get(roomId).filter((user) => user.socketId !== socket.id);
            if (users.length > 0) {
                this.rooms.set(roomId, users);
            } else {
                this.rooms.delete(roomId);
            }
            this.server.to(roomId).emit("room_users", this.rooms.get(roomId));
        }
    }

    @SubscribeMessage("get_room_users")
    handleGetRoomUsers(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
        socket.emit("room_users", this.rooms.get(roomId) || []);
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
