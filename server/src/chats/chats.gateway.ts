import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
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

interface UserSocket extends Socket {
    user?: any;
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
    handleJoin(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
        socket.join(roomId);
        // this.roomsService.addUserToRoom(roomId)
    }

    @SubscribeMessage("new_message")
    handleMessage(@MessageBody() messageInfo: MessageInfoDTO): void {
        this.server
            .to(messageInfo.roomId)
            .emit("new_message", { time: new Date(), ...messageInfo });
    }
}
