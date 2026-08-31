import { createContext, useContext, useEffect, useMemo } from "react";
import { socket } from "./socket";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { getToken } from "../storage/token-manager";
import { groupEventDispatch } from "./group-event-dispatch";
import { useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import { log } from "../logging/logger";

type SocketContextValue = {
  socket: Socket | null;
};

export type GroupEvent = {
  groupId: string;
  type: string;
  data: any;
};

const SocketContext = createContext<SocketContextValue>({
  socket: null,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthProvider();
  const queryClient = useQueryClient();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      socket.disconnect();
      return;
    }

    function onConnect() {
      log.info("/socket-provider.tsx - onConnect | Socket connected:", {
        connected: socket.connected,
        socketId: socket.id,
        userId: userId,
      });
    }

    function onDisconnect(reason: string) {
      log.info("Socket disconnected:", {
        reason,
      });
    }

    function onConnectError(error: Error) {
      log.error("Socket connection error:", {
        message: error.message,
      });
    }

    function onGroupEvent(event: GroupEvent) {
      log.info("/socket-provider.tsx - onGroupEvent | Group Event:", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });

      groupEventDispatch(event, queryClient);
    }

    async function connectSocket() {
      const token = await getToken();

      if (!token) {
        throw new Error("Unable to connect to socket, no access token provided");
      }

      socket.auth = {
        token: token,
      };

      if (!socket.connected) {
        socket.connect();
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("group_event", onGroupEvent);

    connectSocket();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("group_event", onGroupEvent);
      socket.disconnect();
    };
  }, [userId]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return context;
}
