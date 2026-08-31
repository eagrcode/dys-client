import { listKeys } from "@/features/lists/queries/list-keys";
import type { CacheIdentifier } from "@/features/lists/queries/list-keys";
import type { GroupEvent } from "./socket-provider";
import type { QueryClient } from "@tanstack/react-query";
import { log } from "../logging/logger";

export async function groupEventDispatch(event: GroupEvent, queryClient: QueryClient) {
  log.info("/group-event-dispatch.ts - groupEventDispatch() | Group Event Received", {
    groupId: event.groupId,
    type: event.type,
    data: event.data,
    callerSocketId: event.callerSocketId,
  });

  switch (event.type) {
    // Lists
    case "list.created":
      await invalidateCache(["group", "dashboard"], queryClient, event.groupId);
      break;

    case "list.deleted":
      await invalidateCache(
        ["group", "dashboard", "detail"],
        queryClient,
        event.groupId,
        event.data.id,
      );
      break;

    case "list.renamed":
      await invalidateCache(["group", "detail"], queryClient, event.groupId, event.data.list_id);
      break;

    // List Items
    case "listItem.created":
      await invalidateCache(
        ["group", "dashboard", "detail"],
        queryClient,
        event.groupId,
        event.data.list_id,
      );
      break;

    case "listItem.deleted":
      await invalidateCache(
        ["group", "dashboard", "detail"],
        queryClient,
        event.groupId,
        event.data.list_id,
      );
      break;

    case "listItem.updated":
      await invalidateCache(["detail"], queryClient, event.groupId, event.data.list_id);
      break;

    case "listItem.toggled":
      await invalidateCache(
        ["group", "dashboard", "detail"],
        queryClient,
        event.groupId,
        event.data.list_id,
      );
      break;

    case "listItem.toggledAll":
      await invalidateCache(
        ["group", "dashboard", "detail"],
        queryClient,
        event.groupId,
        event.data.list_id,
      );
      break;

    default:
      log.warn("Unhandled Group Event", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });
      break;
  }
}

async function invalidateCache(
  cacheIdentifiers: CacheIdentifier[],
  queryClient: QueryClient,
  groupId: string,
  listId?: string,
) {
  const promises: Promise<void>[] = [];

  for (const key of cacheIdentifiers) {
    switch (key) {
      case "group":
        promises.push(
          queryClient.invalidateQueries({
            queryKey: listKeys.group(groupId),
            exact: true,
          }),
        );
        break;
      case "detail":
        if (listId) {
          promises.push(
            queryClient.invalidateQueries({
              queryKey: listKeys.detail(groupId, listId),
              exact: true,
            }),
          );
        } else {
          log.warn("List ID is required for 'detail' cache invalidation", {
            groupId,
            listId,
          });
        }
        break;
      case "dashboard":
        promises.push(
          queryClient.invalidateQueries({
            queryKey: listKeys.dashboard(groupId),
            exact: true,
          }),
        );
        break;
    }
  }
  await Promise.all(promises);
}
