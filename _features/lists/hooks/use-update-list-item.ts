import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useSelectedGroup } from "@/_shared/hooks/use-selected-group";
import { listKeys } from "../qk.lists";
import type { List, UpdateListItemResponse } from "@/_features/lists/lists-types";
import type { ApiError } from "@/_shared/types/api-error";

type Vars = {
  listId: string;
  itemId: string;
  content: string;
};

type Context = {
  queryKey: readonly unknown[];
  prevList: List | undefined;
};

export function useUpdateListItem() {
  const queryClient = useQueryClient();
  const selectedGroup = useSelectedGroup();

  return useMutation<UpdateListItemResponse, ApiError, Vars, Context>({
    mutationFn: ({ listId, itemId, content }) => {
      return listsAPI.updateListItem(selectedGroup, listId, itemId, content);
    },

    onMutate: async ({ listId, itemId, content }) => {
      const queryKey = listKeys.detail(selectedGroup, listId);

      await queryClient.cancelQueries({ queryKey });

      const prevList = queryClient.getQueryData<List>(queryKey);

      queryClient.setQueryData<List>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items?.map((item) =>
            item.id === itemId ? { ...item, content, updated_at: new Date().toISOString() } : item,
          ),
        };
      });

      return { queryKey, prevList };
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      queryClient.setQueryData(context.queryKey, context.prevList);
    },

    onSettled: (_data, _error, _vars, context) => {
      if (!context) return;
      queryClient.invalidateQueries({ queryKey: context.queryKey });
    },
  });
}
