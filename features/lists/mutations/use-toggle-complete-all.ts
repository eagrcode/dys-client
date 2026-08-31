import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/features/lists/api/lists-api";
import { listKeys } from "@/features/lists/queries/list-keys";
import { useStoredGroupId } from "@/shared/hooks/use-stored-group-id";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiError } from "@/shared/api/api-error";
import type { List, ListItem } from "@/features/lists/types/t-list";
import type { ToggleCompleteAllListItems } from "@/features/lists/types/t-lists-api";

type Vars = {
  listId: string;
  completed: boolean;
};

type Context = {
  listDetailQK: QueryKey;
  listsQK: QueryKey;
  dashboardQK: QueryKey;
  prevList: List | undefined;
};

export function useToggleCompleteAllListItems() {
  const queryClient = useQueryClient();
  const storedGroupId = useStoredGroupId();

  return useMutation<ToggleCompleteAllListItems.Response, ApiError, Vars, Context>({
    mutationFn: ({ listId, completed }) => {
      return listsAPI.toggleCompleteAllListItems({
        groupId: storedGroupId,
        listId,
        completed,
      });
    },

    onMutate: async ({ listId, completed }) => {
      const listDetailQK = listKeys.detail(storedGroupId, listId);
      const listsQK = listKeys.group(storedGroupId);
      const dashboardQK = listKeys.dashboard(storedGroupId);

      await queryClient.cancelQueries({ queryKey: listDetailQK });

      const prevList = queryClient.getQueryData<List>(listDetailQK);

      queryClient.setQueryData<List>(listDetailQK, (old) => {
        if (!old || !old.items) return old;

        return {
          ...old,
          items: old.items.map((item: ListItem) => ({
            ...item,
            completed,
          })),
        };
      });

      return {
        listDetailQK,
        listsQK,
        dashboardQK,
        prevList,
      };
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      queryClient.setQueryData(context.listDetailQK, context.prevList);
    },

    onSettled: (_data, _error, _vars, context) => {
      if (!context) return;

      queryClient.invalidateQueries({ queryKey: context.listDetailQK, exact: true });
      queryClient.invalidateQueries({ queryKey: context.listsQK, exact: true });
      queryClient.invalidateQueries({ queryKey: context.dashboardQK, exact: true });
    },
  });
}
