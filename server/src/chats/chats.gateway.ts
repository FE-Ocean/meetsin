import { Logger } from "@nestjs/common";
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

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

    afterInit(server: any) {
        this.logger.log("init");
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`connect ${socket.id} ${socket.nsp.name}`);
    }

    handleDisconnect(client: any) {
        this.logger.log("disconnect");
    }

    @SubscribeMessage("message")
    handleMessage(client: any, payload: any): string {
        return "Hello world!";
    }
}
