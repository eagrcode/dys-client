import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import type { ApiErrorResponse } from "@/utils/types/ApiError";
import type { List, ListItem } from "@/utils/types/T_Lists";

type DeleteListItemsVars = {
  listId: string;
  itemIds: string[];
};

type DeleteListItemsContext = {
  listQueryKey: readonly unknown[];
  groupListsQueryKey: readonly unknown[];
  dashboardListsQueryKey: readonly unknown[];
  prevList: List | undefined;
};

export function useDeleteListItems() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();

  return useMutation<
    { deletedItemIds: string[] },
    ApiErrorResponse,
    DeleteListItemsVars,
    DeleteListItemsContext
  >({
    mutationFn: ({ listId, itemIds }) => {
      if (!selectedGroup) throw new Error("No group selected");

      console.log("useDeleteListItems | Firing query", {
        listId: listId,
        itemIds: itemIds,
      });

      return listsAPI.deleteListItems({
        groupId: selectedGroup,
        listId,
        itemIds,
      });
    },

    onMutate: async ({ listId, itemIds }) => {
      const listQueryKey = ["list", user?.id, selectedGroup, listId] as const;
      const groupListsQueryKey = ["groupLists", user?.id, selectedGroup] as const;
      const dashboardListsQueryKey = ["dashboardData", user?.id, selectedGroup, "lists"] as const;

      await queryClient.cancelQueries({ queryKey: listQueryKey });

      const prevList = queryClient.getQueryData<List>(listQueryKey);

      queryClient.setQueryData<List>(listQueryKey, (old) => {
        if (!old || !old.items) return old;

        return {
          ...old,
          items: old.items.filter((item) => {
            return !itemIds.includes(item.id);
          }),
        };
      });

      return {
        listQueryKey,
        groupListsQueryKey,
        dashboardListsQueryKey,
        prevList,
      };
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      queryClient.setQueryData(context.listQueryKey, context.prevList);
    },

    onSettled: (_data, _error, _vars, context) => {
      if (!context) return;

      queryClient.invalidateQueries({ queryKey: context.listQueryKey });
      queryClient.invalidateQueries({ queryKey: context.groupListsQueryKey });
      queryClient.invalidateQueries({ queryKey: context.dashboardListsQueryKey });
    },
  });
}
