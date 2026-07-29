import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useSelectedGroup } from "@/_shared/hooks/use-selected-group";
import { listKeys } from "@/_features/lists/qk.lists";
import type { ApiError } from "@/_shared/types/api-error";
import type { ToggleCompleteListItemResponse, List } from "@/_features/lists/lists-types";
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
  const selectedGroup = useSelectedGroup();

  return useMutation<ToggleCompleteListItemResponse, ApiError, Vars, Context>({
    mutationFn: ({ listId, itemId, completed }) => {
      return listsAPI.toggleCompleteListItem({
        groupId: selectedGroup,
        listId,
        itemId,
        completed,
      });
    },

    onMutate: async ({ listId, itemId, completed }) => {
      const listDetailQK = listKeys.detail(selectedGroup, listId);
      const listsQK = listKeys.group(selectedGroup);
      const dashboardQK = listKeys.dashboard(selectedGroup);

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
