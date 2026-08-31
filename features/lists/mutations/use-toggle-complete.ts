import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/features/lists/api/lists-api";
import { useStoredGroupId } from "@/shared/hooks/use-stored-group-id";
import { listKeys } from "@/features/lists/queries/list-keys.ts";
import type { ApiError } from "@/shared/api/api-error";
import type { List } from "@/features/lists/types/t-list";
import type { ToggleCompleteListItem } from "@/features/lists/types/t-lists-api";
import type { QueryKey } from "@tanstack/react-query";

type Vars = {
  listId: string;
  itemId: string;
  completed: boolean;
};

type Context = {
  listDetailQK: QueryKey;
  listsQK: QueryKey;
  dashboardQK: QueryKey;
  prevList: List | undefined;
};

export function useToggleCompleteListItem() {
  const queryClient = useQueryClient();
  const storedGroupId = useStoredGroupId();

  return useMutation<ToggleCompleteListItem.Response, ApiError, Vars, Context>({
    mutationFn: ({ listId, itemId, completed }) => {
      return listsAPI.toggleCompleteListItem({
        groupId: storedGroupId,
        listId,
        itemId,
        completed,
      });
    },

    onMutate: async ({ listId, itemId, completed }) => {
      const listDetailQK = listKeys.detail(storedGroupId, listId);
      const listsQK = listKeys.group(storedGroupId);
      const dashboardQK = listKeys.dashboard(storedGroupId);

      await queryClient.cancelQueries({ queryKey: listDetailQK });

      const prevList = queryClient.getQueryData<List>(listDetailQK);

      queryClient.setQueryData<List>(listDetailQK, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items?.map((item) => (item.id === itemId ? { ...item, completed } : item)),
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

      queryClient.invalidateQueries({ queryKey: context.listDetailQK });
      queryClient.invalidateQueries({ queryKey: context.listsQK });
      queryClient.invalidateQueries({ queryKey: context.dashboardQK });
    },
  });
}
