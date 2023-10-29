import { Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayDisconnect,
    MessageBody,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

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

    constructor(private readonly jwtService: JwtService) {}

    afterInit(server: any) {
        this.logger.log("init");
    }

    handleConnection(@ConnectedSocket() socket: UserSocket) {
        this.logger.log(`connect ${socket.id} ${socket.nsp.name}`);
        const token = socket.handshake.query.token as string;

        try {
            const user = this.jwtService.verify(token);
            socket.user = user;
        } catch (error) {
            socket.disconnect();
            throw new UnauthorizedException("UnAuthorized!");
        }
    }

    handleDisconnect(client: any) {
        this.logger.log("disconnect");
    }

    @SubscribeMessage("new_message")
    handleMessage(@MessageBody() messageInfo: any, @ConnectedSocket() socket: Socket): void {
        socket.emit("new_message", { time: new Date(), ...messageInfo });
        socket.broadcast.emit("new_message", { time: new Date(), ...messageInfo });
    }
}
