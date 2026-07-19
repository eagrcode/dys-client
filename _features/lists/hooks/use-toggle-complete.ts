import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import type { ApiErrorResponse } from "@/_shared/types/api-error";
import type { ToggleCompleteListItemResponse, List } from "@/_features/lists/lists-types";

type ToggleCompleteListItemVars = {
  listId: string;
  itemId: string;
  completed: boolean;
};

type ToggleCompleteListItemContext = {
  listQueryKey: readonly unknown[];
  groupListsQueryKey: readonly unknown[];
  dashboardListsQueryKey: readonly unknown[];
  prevList: List | undefined;
};

export function useToggleCompleteListItem() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();

  return useMutation<
    ToggleCompleteListItemResponse,
    ApiErrorResponse,
    ToggleCompleteListItemVars,
    ToggleCompleteListItemContext
  >({
    mutationFn: ({ listId, itemId, completed }) => {
      if (!selectedGroup) throw new Error("No group selected");

      return listsAPI.toggleCompleteListItem({
        groupId: selectedGroup,
        listId,
        itemId,
        completed,
      });
    },

    onMutate: async ({ listId, itemId, completed }) => {
      const listQueryKey = ["list", user?.id, selectedGroup, listId] as const;
      const groupListsQueryKey = ["groupLists", user?.id, selectedGroup] as const;
      const dashboardListsQueryKey = ["dashboardData", user?.id, selectedGroup, "lists"] as const;

      await queryClient.cancelQueries({ queryKey: listQueryKey });

      const prevList = queryClient.getQueryData<List>(listQueryKey);

      queryClient.setQueryData<List>(listQueryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items?.map((item) => (item.id === itemId ? { ...item, completed } : item)),
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
