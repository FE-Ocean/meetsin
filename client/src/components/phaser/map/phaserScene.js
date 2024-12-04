const PLAYER_SPEED = 3;

export class MeetsInPhaserScene extends Phaser.Scene {
    constructor(roomId, user, socket) {
        super();
        this.user = user;
        this.roomId = roomId;
        this.socket = socket;
        this.otherPlayers = null;
        this.myCharacterId = null;
    }

    preload() {
        this.load.image("background", "/space.jpg");
        for (let i = 1; i <= 6; i++) {
            this.load.spritesheet(`player${i}`, `/player${i}.png`, {
                frameWidth: 34,
                frameHeight: 35,
            });
        }
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
        this.socket.emit("join_phaser_room", this.roomId);
        this.socket.on("roomInfo", (roomInfo) => this.handleRoomInfo(roomInfo));
        this.socket.on("newPlayer", ({ playerInfo }) => this.addOtherPlayers(playerInfo));
        this.socket.on("move", (info) => this.moveOtherPlayer(info));
        this.socket.on("stop", (info) => this.stopOtherPlayer(info));
        this.socket.on("userDisconnected", (info) => this.removePlayer(info.user.userId));
    }

    handleRoomInfo(roomInfo) {
        const { players } = roomInfo;
        Object.entries(players).forEach(([id, playerInfo]) => {
            id === this.socket.id ? this.addPlayer(playerInfo) : this.addOtherPlayers(playerInfo);
        });
    }

    setupAnimations() {
        for (let i = 1; i <= 6; i++) {
            const spriteKey = `player${i}`;

            this.anims.create({
                key: `walk-right-${i}`,
                frames: this.anims.generateFrameNumbers(spriteKey, { frames: [3, 7, 11] }),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: `walk-down-${i}`,
                frames: this.anims.generateFrameNumbers(spriteKey, { frames: [1, 5, 9] }),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: `walk-left-${i}`,
                frames: this.anims.generateFrameNumbers(spriteKey, { frames: [0, 4, 8] }),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: `walk-up-${i}`,
                frames: this.anims.generateFrameNumbers(spriteKey, { frames: [2, 6, 10] }),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: `player_idle_${i}`,
                frames: [{ key: spriteKey, frame: 1 }],
                frameRate: 1,
            });
        }
    }

    handlePlayerMovement(player) {
        if (this.isAnyCursorKeyDown()) {
            player.moving = true;
            this.emitPlayerMovement(player, this.getCurrentDirection());
        }
        if (this.isAllCursorKeyUp() && player.moving) {
            this.emitStopMovement();
            player.moving = false;
        }

        if (this.keyboardInput.left.isDown) {
            if (
                !player.anims.isPlaying ||
                player.anims.currentAnim.key !== `walk-left-${this.myCharacterId}`
            ) {
                player.play(`walk-left-${this.myCharacterId}`);
            }
            player.x -= PLAYER_SPEED;
        } else if (this.keyboardInput.right.isDown) {
            if (
                !player.anims.isPlaying ||
                player.anims.currentAnim.key !== `walk-right-${this.myCharacterId}`
            ) {
                player.play(`walk-right-${this.myCharacterId}`);
            }
            player.x += PLAYER_SPEED;
        } else if (this.keyboardInput.up.isDown) {
            if (
                !player.anims.isPlaying ||
                player.anims.currentAnim.key !== `walk-up-${this.myCharacterId}`
            ) {
                player.play(`walk-up-${this.myCharacterId}`);
            }
            player.y -= PLAYER_SPEED;
        } else if (this.keyboardInput.down.isDown) {
            if (
                !player.anims.isPlaying ||
                player.anims.currentAnim.key !== `walk-down-${this.myCharacterId}`
            ) {
                player.play(`walk-down-${this.myCharacterId}`);
            }
            player.y += PLAYER_SPEED;
        } else {
            if (player.anims.isPlaying) {
                player.play(`player_idle_${this.myCharacterId}`);
            }
        }
    }

    getCurrentDirection() {
        if (this.keyboardInput.left.isDown) {
            return "left";
        }

        if (this.keyboardInput.right.isDown) {
            return "right";
        }

        if (this.keyboardInput.up.isDown) {
            return "up";
        }

        if (this.keyboardInput.down.isDown) {
            return "down";
        }
        return null;
    }

    isAnyCursorKeyDown() {
        return (
            this.keyboardInput.left.isDown ||
            this.keyboardInput.right.isDown ||
            this.keyboardInput.up.isDown ||
            this.keyboardInput.down.isDown
        );
    }

    isAllCursorKeyUp() {
        return (
            this.keyboardInput.left.isUp &&
            this.keyboardInput.right.isUp &&
            this.keyboardInput.up.isUp &&
            this.keyboardInput.down.isUp
        );
    }

    emitPlayerMovement(player, direction) {
        if (!player || !this.socket) return;
        this.socket.emit("move", { x: player.x, y: player.y, roomId: this.roomId, direction });
    }

    emitStopMovement() {
        if (!this.socket) return;
        this.socket.emit("stop", { playerId: this.player.playerId, roomId: this.roomId });
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

    stopOtherPlayer(info) {
        if (!this.otherPlayers) return;

        this.otherPlayers.getChildren().forEach((otherPlayer) => {
            if (info.playerId === otherPlayer.playerId) {
                this.animateOtherPlayerStop(otherPlayer);
            }
        });
    }

    animateOtherPlayerMovement(otherPlayer, info) {
        const direction = info.direction;
        const animationKey = `walk-${direction}-${otherPlayer.characterId}`;

        if (!otherPlayer.anims.isPlaying || otherPlayer.anims.currentAnim.key !== animationKey) {
            otherPlayer.play(animationKey);
        }

        otherPlayer.moving = true;
        otherPlayer.setPosition(info.x, info.y);
    }

    animateOtherPlayerStop(otherPlayer) {
        if (otherPlayer.moving) {
            otherPlayer.play(`player_idle_${otherPlayer.characterId}`);
        }
        otherPlayer.moving = false;
    }

    addPlayer(playerInfo) {
        this.myCharacterId = playerInfo.characterId;
        const spriteKey = `player${playerInfo.characterId}`;

        const player = this.physics.add.sprite(playerInfo.x, playerInfo.y, spriteKey);
        player.setCollideWorldBounds(true);
        player.setFrame(1);
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
        const spriteKey = `player${playerInfo.characterId}`;
        const otherPlayer = this.physics.add.sprite(playerInfo.x, playerInfo.y, spriteKey);
        otherPlayer.setCollideWorldBounds(true);
        otherPlayer.setFrame(1);
        otherPlayer.playerId = playerInfo.playerId;
        otherPlayer.characterId = playerInfo.characterId;
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
