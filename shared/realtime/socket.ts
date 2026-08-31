import { io } from "socket.io-client";
import { API_BASE_URL } from "@/shared/config/environment";

export const socket = io(API_BASE_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000, // 1 second
  reconnectionDelayMax: 5000, // 5 seconds
  reconnectionAttempts: Infinity,
  transports: ["websocket"],
});
