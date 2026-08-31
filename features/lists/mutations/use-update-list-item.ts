import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/features/lists/api/lists-api";
import { useStoredGroupId } from "@/shared/hooks/use-stored-group-id";
import { listKeys } from "../queries/list-keys.ts";
import type { List } from "@/features/lists/types/t-list";
import type { UpdateListItem } from "@/features/lists/types/t-lists-api";
import type { ApiError } from "@/shared/api/api-error";

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
  const storedGroupId = useStoredGroupId();

  return useMutation<UpdateListItem.Response, ApiError, Vars, Context>({
    mutationFn: ({ listId, itemId, content }) => {
      return listsAPI.updateListItem({
        groupId: storedGroupId,
        listId,
        itemId,
        content,
      });
    },

    onMutate: async ({ listId, itemId, content }) => {
      const queryKey = listKeys.detail(storedGroupId, listId);

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
