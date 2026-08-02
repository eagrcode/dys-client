import { io } from "socket.io-client";
import { API_BASE_URL } from "@/_shared/config/environment";

export const socket = io(API_BASE_URL, {
  autoConnect: false,
});
