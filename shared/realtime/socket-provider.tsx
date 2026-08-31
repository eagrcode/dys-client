import { createContext, useContext, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { getToken } from "../storage/token-manager";
import { groupEventDispatch } from "./group-event-dispatch";
import { focusManager, useQueryClient } from "@tanstack/react-query";
import { router, useGlobalSearchParams, usePathname } from "expo-router";
import { handleEventNavigation } from "./handle-event-navigation";
import { AppState, type AppStateStatus } from "react-native";
import { performRefreshTokens } from "@/shared/auth/token-refresh";
import type { Socket } from "socket.io-client";
import { log } from "../logging/logger";

type SocketContextValue = {
  socket: Socket | null;
};

export type GroupEvent = {
  groupId: string;
  type: string;
  data: any;
  callerSocketId: string;
};

const TOKEN_REFRESH_MAX_ATTEMPTS = 1;

const SocketContext = createContext<SocketContextValue>({
  socket: null,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { listId } = useGlobalSearchParams<{ listId: string }>();
  const { user, signOut } = useAuthProvider();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // Refs
  const pathnameRef = useRef(pathname);
  const paramRef = useRef<{ listId?: string }>({ listId });
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const resyncRequiredRef = useRef(false);
  const tokenRefreshAttemptsRef = useRef(0);

  const userId = user?.id;

  // Update refs whenever pathname or listId changes
  useEffect(() => {
    pathnameRef.current = pathname;
    paramRef.current = { listId };
  }, [pathname, listId]);

  // Manage socket lifecycle
  useEffect(() => {
    log.debug("/socket-provider.tsx | useEffect() - Setting up socket lifecycle", {
      userId,
      appState: appStateRef.current,
    });

    if (!userId) {
      socket?.disconnect();
      return;
    }

    const onConnect = async () => {
      log.info("/socket-provider.tsx | onConnect() - Socket connected", {
        socketId: socket.id,
        userId,
        recovered: socket.recovered,
      });

      tokenRefreshAttemptsRef.current = 0;

      if (resyncRequiredRef.current) {
        log.info("/socket-provider.tsx | onConnect() - Invalidating queries after disconnect");

        await queryClient.invalidateQueries();
        resyncRequiredRef.current = false;

        log.info("/socket-provider.tsx | onConnect() - Query invalidation complete");
      }
    };

    const onDisconnect = (reason: string) => {
      log.info("/socket-provider.tsx | onDisconnect() - Socket disconnected", {
        userId,
        reason,
        active: socket.active,
      });

      if (socket.active) {
        resyncRequiredRef.current = true;
      }
    };

    const onConnectError = async (error: any) => {
      const errorCode = error.data?.code
        ? error.data.code
        : error.type === "TransportError"
          ? "TRANSPORT_ERROR"
          : "CONNECTION_ERROR";
      const errorMessage = error.message || "An unknown error occurred during socket connection";

      log.warn("/socket-provider.tsx | onConnectError() - Socket connection error", {
        userId,
        message: errorMessage,
        code: errorCode,
        active: socket.active,
      });

      const isTokenError =
        errorCode === "TOKEN_EXPIRED" ||
        errorCode === "TOKEN_INVALID" ||
        errorCode === "TOKEN_MISSING";

      if (!isTokenError) {
        return;
      }

      if (tokenRefreshAttemptsRef.current >= TOKEN_REFRESH_MAX_ATTEMPTS) {
        log.warn(
          "/socket-provider.tsx | onConnectError() - Token refresh limit reached, signing out",
          {
            userId,
            attempts: tokenRefreshAttemptsRef.current,
          },
        );
        await signOut();
        return;
      }

      tokenRefreshAttemptsRef.current += 1;

      try {
        log.info("/socket-provider.tsx | onConnectError() - Attempting token refresh", {
          userId,
          attempt: tokenRefreshAttemptsRef.current,
        });
        const refreshSucceeded = await performRefreshTokens();

        if (!refreshSucceeded) {
          log.warn(
            "/socket-provider.tsx | onConnectError() - Unable to refresh session, signing out",
            {
              userId,
            },
          );
          await signOut();
          return;
        }

        await connectSocket();
      } catch (error) {
        log.error("/socket-provider.tsx | onConnectError() - Authentication recovery failed", {
          userId,
          error,
        });
      }
    };

    const onGroupEvent = async (event: GroupEvent) => {
      log.debug("/socket-provider.tsx | onGroupEvent() - Group event received", {
        groupId: event.groupId,
        type: event.type,
        currentPath: pathnameRef.current,
        callerSocketId: event.callerSocketId,
      });

      const socketUserLocation = {
        currentPath: pathnameRef.current,
        currentRouteParams: paramRef.current,
      };

      await groupEventDispatch(event, queryClient);
      handleEventNavigation(event, router, socketUserLocation);
    };

    const onReconnectAttempt = (attempt: number) => {
      log.info("/socket-provider.tsx | onReconnectAttempt()", {
        userId,
        attempt,
      });
    };

    const onReconnect = (attempt: number) => {
      log.info("/socket-provider.tsx | onReconnect()", {
        userId,
        attempt,
        socketConnected: socket.connected,
      });
    };

    // Connection errors are logged by onConnectError
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.io.on("reconnect", onReconnect);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("group_event", onGroupEvent);

    void connectSocket();

    return () => {
      log.debug("/socket-provider.tsx | useEffect() - Cleaning up socket lifecycle", {
        userId,
      });

      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.io.off("reconnect", onReconnect);

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("group_event", onGroupEvent);
      socket.disconnect();
    };
  }, [userId]);

  // Handle socket connection - connect if user is logged in and app is active
  const connectSocket = async () => {
    const shouldConnect = userId && appStateRef.current === "active" && !socket.connected;

    if (!shouldConnect) {
      log.debug("/socket-provider.tsx | connectSocket() - Skipping connection", {
        userId,
        appState: appStateRef.current,
        socketConnected: socket.connected,
      });
      return;
    }

    log.info("/socket-provider.tsx | connectSocket() - Attempting to connect socket", {
      userId,
    });
    const token = await getToken();

    if (!token) {
      throw new Error("Unable to connect to socket, no access token provided");
    }

    socket.auth = {
      token: token,
    };

    socket.connect();
  };

  // APP STATE MANAGEMENT

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, [userId]);

  // Handle app state changes - focus management and query refetching
  const onAppStateChange = (nextState: AppStateStatus) => {
    appStateRef.current = nextState;

    const currentState = appStateRef.current;
    const isBackground = currentState === "background";
    const isActive = currentState === "active";

    log.debug("/socket-provider.tsx | onAppStateChange() - App state changed", {
      appState: currentState,
    });

    focusManager.setFocused(isActive);

    if (isBackground) {
      resyncRequiredRef.current = true;

      handleEnterBackground();
    }

    if (isActive) {
      void handleEnterForeground();
    }
  };

  // Handle app backgrounding - disconnect socket and mark resync required
  const handleEnterBackground = () => {
    log.info("/socket-provider.tsx | handleEnterBackground() - Disconnecting socket", {
      userId,
    });
    socket.disconnect();
  };

  // Handle app foregrounding - reconnect socket if user is logged in and app is active
  const handleEnterForeground = () => {
    log.debug("/socket-provider.tsx | handleEnterForeground() - Requesting socket connection", {
      userId,
    });
    connectSocket();
  };

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return context;
}
