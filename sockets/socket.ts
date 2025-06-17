import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./socketTypes";

export const socket : Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000", {
    autoConnect: false,
    withCredentials: true
});