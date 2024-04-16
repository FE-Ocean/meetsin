export const phaserConfig = {
    type: Phaser.AUTO,
    backgroundColor: "black",
    physics: {
        default: "arcade",
        arcade: {
            debug: process.env.DEBUG === "true",
        },
    },
    scale: {
        // 게임 div의 id
        parent: "gamediv",
        width: "100%",
        height: "100%",
    },
};
