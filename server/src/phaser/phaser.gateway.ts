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
import { MoveInfoDto, StopPlayerInfoDto } from "src/dto/phaser.dto";

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
    namespace: "phaser",
})
export class PhaserGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    private logger = new Logger("phaser");
    private gameRooms = {};
    private socketRoomMap: Map<string, string>;

    constructor() {
        this.socketRoomMap = new Map<string, string>();
    }

    @WebSocketServer() server: Server;

    afterInit(server: any) {
        this.logger.log("phaser Init");
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`connect ${socket.id} ${socket.nsp.name}`);

        const userName = socket.handshake.query.userName;

        this.logger.log(`user : ${userName}`);

        socket.data.user = { userName };
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        const roomId = this.socketRoomMap.get(socket.id);
        this.server
            .to(roomId)
            .emit("userDisconnected", { user: { username: socket.data.user, userId: socket.id } });

        delete this.gameRooms[roomId]?.players[socket.id];
    }

    @SubscribeMessage("join_room")
    handleJoin(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
        this.logger.log(`방 참가 신청 ${roomId} ${socket.id}`);
        socket.join(roomId);
        this.socketRoomMap.set(socket.id, roomId);

        const playerInfo = {
            rotation: 0,
            x: 400,
            y: 300,
            playerId: socket.id,
            user: socket.data.user,
        };

        if (this.gameRooms[roomId]) {
            this.gameRooms[roomId].players[socket.id] = playerInfo;
        } else {
            this.gameRooms[roomId] = { players: { [socket.id]: playerInfo } };
        }

        socket.emit("roomInfo", this.gameRooms[roomId]);
        socket.to(roomId).emit("newPlayer", { playerInfo });
    }

    @SubscribeMessage("move")
    handleMove(@MessageBody() moveInfo: MoveInfoDto, @ConnectedSocket() socket: Socket) {
        const { x, y, roomId, direction } = moveInfo;

        this.gameRooms[roomId].players[socket.id].x = x;
        this.gameRooms[roomId].players[socket.id].y = y;
        this.gameRooms[roomId].players[socket.id].direction = direction;

        socket.to(roomId).emit("move", this.gameRooms[roomId].players[socket.id]);
    }

    @SubscribeMessage("stop")
    handleStop(@MessageBody() info: StopPlayerInfoDto, @ConnectedSocket() socket: Socket) {
        const { roomId } = info;

        socket.to(roomId).emit("stop", this.gameRooms[roomId].players[socket.id]);
    }
}
