import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useSelectedGroup } from "@/_shared/hooks/use-selected-group";
import { listKeys } from "@/_features/lists/qk.lists";
import type { ApiError } from "@/_shared/types/api-error";
import type { DeleteListItemsResponse, List } from "@/_features/lists/lists-types";
import type { QueryKey } from "@tanstack/react-query";

type Vars = {
  listId: string;
  itemIds: string[];
};

type Context = {
  listDetailQK: QueryKey;
  listsQK: QueryKey;
  dashboardQK: QueryKey;
  prevList: List | undefined;
};

export function useDeleteListItems() {
  const queryClient = useQueryClient();
  const selectedGroup = useSelectedGroup();

  return useMutation<DeleteListItemsResponse, ApiError, Vars, Context>({
    mutationFn: ({ listId, itemIds }) => {
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
      const listDetailQK = listKeys.detail(selectedGroup, listId);
      const listsQK = listKeys.group(selectedGroup);
      const dashboardQK = listKeys.dashboard(selectedGroup);

      await queryClient.cancelQueries({ queryKey: listDetailQK });

      const prevList = queryClient.getQueryData<List>(listDetailQK);

      queryClient.setQueryData<List>(listDetailQK, (old) => {
        if (!old || !old.items) return old;

        return {
          ...old,
          items: old.items.filter((item) => {
            return !itemIds.includes(item.id);
          }),
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
