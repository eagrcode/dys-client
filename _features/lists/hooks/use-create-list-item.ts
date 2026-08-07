import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { listKeys } from "@/_features/lists/qk.lists";
import { useStoredGroupId } from "@/_shared/hooks/use-stored-group-id";
import type { ListItem, List } from "@/_features/lists/lists-types";
import type { ApiError } from "@/_shared/types/api-error";
import type { QueryKey } from "@tanstack/react-query";

type Vars = {
  listId: string;
  content: string;
};

type Context = {
  listDetailQK: QueryKey;
  groupListsQK: QueryKey;
  dashboardQK: QueryKey;
  prevList: List | undefined;
  optimisticItemId: string;
};

export function useCreateListItem() {
  const queryClient = useQueryClient();
  const storedGroupId = useStoredGroupId();

  return useMutation<ListItem, ApiError, Vars, Context>({
    mutationFn: ({ listId, content }) => {
      return listsAPI.createListItem(storedGroupId, listId, content);
    },

    onMutate: async ({ listId, content }) => {
      const listDetailQK = listKeys.detail(storedGroupId, listId);
      const groupListsQK = listKeys.group(storedGroupId);
      const dashboardQK = listKeys.dashboard(storedGroupId);
      const optimisticItemId = `temp-${Date.now()}-${Math.random()}`;

      await queryClient.cancelQueries({ queryKey: listDetailQK });

      const prevList = queryClient.getQueryData<List>(listDetailQK);

      queryClient.setQueryData<List>(listDetailQK, (old) => {
        if (!old) return old;

        const optimisticItem: ListItem = {
          id: optimisticItemId,
          list_id: listId,
          content: content,
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: null,
        };

        return {
          ...old,
          items: [optimisticItem, ...(old.items ?? [])],
        };
      });

      return { listDetailQK, groupListsQK, dashboardQK, prevList, optimisticItemId };
    },

    onSuccess: (data, _vars, context) => {
      queryClient.setQueryData<List>(context.listDetailQK, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items?.map((item) => (item.id === context.optimisticItemId ? data : item)),
        };
      });
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      queryClient.setQueryData(context.listDetailQK, context.prevList);
    },

    onSettled: (_data, _error, _vars, context) => {
      if (!context) return;
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: context.listDetailQK }),
        queryClient.invalidateQueries({ queryKey: context.groupListsQK }),
        queryClient.invalidateQueries({ queryKey: context.dashboardQK }),
      ]);
    },
  });
}
