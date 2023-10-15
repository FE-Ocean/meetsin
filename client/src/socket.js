import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:8000";

const socketBaseOptions = { autoConnect: false };

export const chatSocket = io(`${URL}/chat`, socketBaseOptions);

export const timerSocket = io(`${URL}/timer`, socketBaseOptions);
