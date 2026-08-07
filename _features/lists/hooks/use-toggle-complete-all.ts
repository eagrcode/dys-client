import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { listKeys } from "@/_features/lists/qk.lists";
import { useStoredGroupId } from "@/_shared/hooks/use-stored-group-id";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiError } from "@/_shared/types/api-error";
import type {
  ToggleCompleteAllListItemsResponse,
  List,
  ListItem,
} from "@/_features/lists/lists-types";

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

  return useMutation<ToggleCompleteAllListItemsResponse, ApiError, Vars, Context>({
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

      queryClient.invalidateQueries({ queryKey: context.listDetailQK });
      queryClient.invalidateQueries({ queryKey: context.listsQK });
      queryClient.invalidateQueries({ queryKey: context.dashboardQK });
    },
  });
}
