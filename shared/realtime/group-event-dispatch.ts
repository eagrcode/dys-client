import { Alert } from "react-native";
import { listKeys } from "@/features/lists/queries/list-keys.ts";
import type { CacheIdentifier } from "@/features/lists/queries/list-keys.ts";
import type { GroupEvent } from "./socket-provider";
import type { QueryClient } from "@tanstack/react-query";
import { log } from "../logging/logger";

export async function groupEventDispatch(event: GroupEvent, queryClient: QueryClient) {
  switch (event.type) {
    // Lists
    case "list.created":
      log.info("Group Event Received", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });

      await invalidateCache(["group", "dashboard"], queryClient, event.groupId);
      break;

    case "list.deleted":
      log.info("Group Event Received", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });

      Alert.alert("List Deleted", "A list has been deleted in this group. Refreshing your lists.");
      await invalidateCache(["group", "dashboard"], queryClient, event.groupId);
      break;

    case "list.renamed":
      log.info("Group Event Received", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });

      await invalidateCache(["group"], queryClient, event.groupId);
      break;

    // List Items
    case "listItem.created":
      log.info("Group Event Received", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });

      await invalidateCache(["group", "dashboard"], queryClient, event.groupId);
      break;

    case "listItem.deleted":
      log.info("Group Event Received", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });

      await invalidateCache(["group", "dashboard"], queryClient, event.groupId);
      break;

    case "listItem.updated":
      log.info("Group Event Received", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });

      await invalidateCache(["detail"], queryClient, event.groupId, event.data.list_id);
      break;

    case "listItem.toggled":
      log.info("Group Event Received", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });

      await invalidateCache(["group", "dashboard"], queryClient, event.groupId);
      break;

    case "listItem.toggledAll":
      log.info("Group Event Received", {
        groupId: event.groupId,
        type: event.type,
        data: event.data,
      });

      await invalidateCache(["group", "dashboard"], queryClient, event.groupId);
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
          }),
        );
        break;
      case "detail":
        if (listId) {
          promises.push(
            queryClient.invalidateQueries({
              queryKey: listKeys.detail(groupId, listId),
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
          }),
        );
        break;
    }
  }
  await Promise.all(promises);
}
