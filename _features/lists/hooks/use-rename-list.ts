import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useStoredGroupId } from "@/_shared/hooks/use-stored-group-id";
import { listKeys } from "@/_features/lists/qk.lists";
import type { List } from "@/_features/lists/lists-types";
import type { ApiError } from "@/_shared/types/api-error";
import type { QueryKey } from "@tanstack/react-query";

type Vars = {
  listId: string;
  newTitle: string;
};

type Context = {
  listDetailQK: QueryKey;
  groupListsQK: QueryKey;
  prevList: List | undefined;
};

export function useRenameList() {
  const queryClient = useQueryClient();
  const storedGroupId = useStoredGroupId();

  return useMutation<{ title: string }, ApiError, Vars, Context>({
    mutationFn: ({ listId, newTitle }) => {
      return listsAPI.renameList(storedGroupId, listId, newTitle);
    },

    onMutate: async ({ listId, newTitle }) => {
      const groupListsQK = listKeys.group(storedGroupId);
      const listDetailQK = listKeys.detail(storedGroupId, listId);

      await queryClient.cancelQueries({ queryKey: listDetailQK });

      const prevList = queryClient.getQueryData<List>(listDetailQK);

      queryClient.setQueryData<List>(listDetailQK, (old) => {
        if (!old) return old;

        return {
          ...old,
          title: newTitle,
        };
      });

      return { listDetailQK, groupListsQK, prevList };
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      queryClient.setQueryData(context.listDetailQK, context.prevList);
    },

    onSettled: (_data, _error, _vars, context) => {
      if (!context) return;
      queryClient.invalidateQueries({ queryKey: context.listDetailQK });
      queryClient.invalidateQueries({ queryKey: context.groupListsQK });
    },
  });
}
