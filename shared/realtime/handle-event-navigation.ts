import { socket } from "./socket";
import type { Router } from "expo-router";
import type { GroupEvent } from "./socket-provider";
import { log } from "../logging/logger";

type SocketUserLocation = {
  currentPath: string;
  currentRouteParams: {
    listId?: string;
  };
};

export function handleEventNavigation(
  event: GroupEvent,
  router: Router,
  socketUserLocation: SocketUserLocation,
) {
  const callerSocketId = event.callerSocketId;
  const isReceiver = callerSocketId !== socket.id;
  const currentPath = socketUserLocation.currentPath;
  const currentRouteParams = socketUserLocation.currentRouteParams;

  if (!isReceiver) {
    log.info("handleEventNavigation() | Ignoring event from self:", {
      event,
      socketUserLocation,
    });
    return;
  }

  log.info("handleEventNavigation() | socketUserLocation:", {
    socketUserLocation,
    callerSocketId,
    isReceiver,
  });

  switch (event.type) {
    case "list.deleted":
      if (
        isReceiver &&
        (currentPath.includes(`/lists/${event.data.id}`) ||
          (currentPath.includes(`/list-detail-actions`) &&
            currentRouteParams.listId === event.data.id))
      ) {
        router.replace("/(app-protected)/lists/overview");
      }
      break;
  }
}
