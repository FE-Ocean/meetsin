"use client";

import { useEffect } from "react";
import style from "./map.module.scss";
import Phaser from "phaser";
import { MeetsInPhaserScene } from "./phaserScene.js";
import { useParams } from "next/navigation";
import { phaserConfig } from "./phaserConfig";
import { io } from "socket.io-client";
import { useGetUserInfo } from "@/app/api/service/user.service";

const Map = () => {
    const { roomId } = useParams();
    const { data: user } = useGetUserInfo();

    useEffect(() => {
        if (!user) return;

        const phaserSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/phaser`, {
            query: {
                userName: user.userName,
            },
            autoConnect: true,
            forceNew: true,
        });

        phaserSocket.on("connect", () => {
            new Phaser.Game({
                ...phaserConfig,
                scene: new MeetsInPhaserScene(roomId, user, phaserSocket),
            });
        });

        phaserSocket.on("error", (error) => {
            console.error("Socket Connect Error : ", error);
        });

        return () => {
            phaserSocket.disconnect();
        };
    }, [user]);

    return <div id="gamediv" className={style.map} />;
};

export default Map;
