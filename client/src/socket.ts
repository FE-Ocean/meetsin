import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const chatSocket = io(`${URL}/chat`, { autoConnect: true, withCredentials: true, transports: ["websocket", "polling", "flashsocket"]  });
