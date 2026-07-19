import { Alert } from "react-native";
import { listKeys } from "@/_features/lists/qk.lists";
import type { GroupEvent } from "./socket-provider";
import type { QueryClient } from "@tanstack/react-query";

export async function groupEventDispatch(event: GroupEvent, queryClient: QueryClient) {
  switch (event.type) {
    case "list.created":
      console.log("List created");
      Alert.alert(
        "Group Event Received",
        JSON.stringify(
          {
            groupId: event.groupId,
            type: event.type,
            data: event.data,
          },
          null,
          2,
        ),
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: listKeys.group(event.groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: listKeys.dashboard(event.groupId),
        }),
      ]);

      break;

    case "list.deleted":
      console.log("List deleted");
      break;

    case "list.updated":
      console.log("List updated");
      break;
  }
}
