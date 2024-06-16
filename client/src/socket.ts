import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:8000";

export const chatSocket = io(`${URL}/chat`, { autoConnect: true });
