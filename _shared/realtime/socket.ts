import { io } from "socket.io-client";

const URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const socket = io(URL, {
  autoConnect: false,
});
