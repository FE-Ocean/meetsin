const PLAYER_SPEED = 5;

export class MeetsInPhaserScene extends Phaser.Scene {
    constructor(roomId, user, socket) {
        super();
        this.user = user;
        this.roomId = roomId;
        this.socket = socket;
        this.otherPlayers = null;
    }

    preload() {
        this.load.image("background", "/space.jpg");
        this.load.spritesheet("player", "/player.png", { frameWidth: 32, frameHeight: 36 });
    }

    create() {
        this.otherPlayers = this.physics.add.group();
        this.setupBackground();
        this.setupSocket();
        this.setupAnimations();
        this.keyboardInput = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.player) this.handlePlayerMovement(this.player);
        this.updateNameTags();
    }

    setupBackground() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
    }

    setupSocket() {
        this.socket.emit("join_room", this.roomId);
        this.socket.on("roomInfo", (roomInfo) => this.handleRoomInfo(roomInfo));
        this.socket.on("newPlayer", ({ playerInfo }) => this.addOtherPlayers(playerInfo));
        this.socket.on("move", (info) => this.moveOtherPlayer(info));
        this.socket.on("userDisconnected", (info) => this.removePlayer(info.user.userId));
    }

    handleRoomInfo(roomInfo) {
        const { players } = roomInfo;
        Object.entries(players).forEach(([id, playerInfo]) => {
            id === this.socket.id ? this.addPlayer(playerInfo) : this.addOtherPlayers(playerInfo);
        });
    }

    setupAnimations() {
        this.anims.create({
            key: "player_anims",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 10 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "player_idle",
            frames: [{ key: "player", frame: 0 }],
            frameRate: 1,
        });
    }

    handlePlayerMovement(player) {
        if (this.isAnyCursorKeyDown()) {
            if (!player.moving) player.play("player_anims");
            player.moving = true;
            this.emitPlayerMovement();
        } else {
            if (player.moving) player.play("player_idle");
            player.moving = false;
        }

        this.updatePlayerPosition(player);
    }

    isAnyCursorKeyDown() {
        return (
            this.keyboardInput.left.isDown ||
            this.keyboardInput.right.isDown ||
            this.keyboardInput.up.isDown ||
            this.keyboardInput.down.isDown
        );
    }

    emitPlayerMovement() {
        if (!this.player || !this.socket) return;
        this.socket.emit("move", { x: this.player.x, y: this.player.y, roomId: this.roomId });
    }

    updatePlayerPosition(player) {
        if (this.keyboardInput.left.isDown) {
            player.x -= PLAYER_SPEED;
            player.flipX = false;
        } else if (this.keyboardInput.right.isDown) {
            player.x += PLAYER_SPEED;
            player.flipX = true;
        }

        if (this.keyboardInput.up.isDown) {
            player.y -= PLAYER_SPEED;
        } else if (this.keyboardInput.down.isDown) {
            player.y += PLAYER_SPEED;
        }
    }

    updateNameTags() {
        if (!this.otherPlayers) return;

        this.otherPlayers.getChildren().forEach((otherPlayer) => {
            otherPlayer.nameTag.x = otherPlayer.x;
            otherPlayer.nameTag.y = otherPlayer.y - 50;
        });
        if (this.player && this.player.nameTag) {
            this.player.nameTag.x = this.player.x;
            this.player.nameTag.y = this.player.y - 50;
        }
    }

    moveOtherPlayer(info) {
        if (!this.otherPlayers) return;

        this.otherPlayers.getChildren().forEach((otherPlayer) => {
            if (info.playerId === otherPlayer.playerId) {
                this.animateOtherPlayerMovement(otherPlayer, info);
            }
        });
    }

    animateOtherPlayerMovement(otherPlayer, info) {
        if (!otherPlayer.moving) otherPlayer.play("player_anims");
        otherPlayer.moving = true;
        otherPlayer.flipX = otherPlayer.x < info.x;
        otherPlayer.setPosition(info.x, info.y);
    }

    addPlayer(playerInfo) {
        const player = this.physics.add.sprite(playerInfo.x, playerInfo.y, "player");
        player.nameTag = this.createNameTag(
            playerInfo.x,
            playerInfo.y - 50,
            playerInfo.user.userName,
        );
        this.player = player;
        this.player.moving = false;
    }

    addOtherPlayers(playerInfo) {
        if (!this.otherPlayers) return;

        const otherPlayer = this.physics.add.sprite(playerInfo.x, playerInfo.y, "player");
        otherPlayer.playerId = playerInfo.playerId;
        otherPlayer.nameTag = this.createNameTag(
            playerInfo.x,
            playerInfo.y - 50,
            playerInfo.user.userName,
        );
        this.otherPlayers.add(otherPlayer);
    }

    createNameTag(x, y, text) {
        return this.add.text(x, y, text, { font: "16px Arial" }).setOrigin(0.5);
    }

    removePlayer(playerId) {
        this.otherPlayers.getChildren().forEach((otherPlayer) => {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.nameTag.destroy();
                otherPlayer.destroy();
            }
        });
    }
}
