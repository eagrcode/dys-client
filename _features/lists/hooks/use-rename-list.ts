import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import type { RenameList } from "../types/t-lists-api";
import { useStoredGroupId } from "@/_shared/hooks/use-stored-group-id";
import { listKeys } from "@/_features/lists/qk.lists";
import type { List } from "@/_features/lists/types/t-list";
import type { ApiError } from "@/_shared/types/api-error";
import type { QueryKey } from "@tanstack/react-query";

type Vars = {
  listId: string;
  newTitle: string;
};

type Context = {
  listDetailQK: QueryKey;
  groupListsQK: QueryKey;
  prevListDetail: List | undefined;
  prevGroupLists: List[] | undefined;
};

export function useRenameList() {
  const queryClient = useQueryClient();
  const storedGroupId = useStoredGroupId();

  return useMutation<RenameList.Response, ApiError, Vars, Context>({
    mutationFn: ({ listId, newTitle }) => {
      return listsAPI.renameList({ groupId: storedGroupId, listId, newTitle });
    },

    onMutate: async ({ listId, newTitle }) => {
      const groupListsQK = listKeys.group(storedGroupId);
      const listDetailQK = listKeys.detail(storedGroupId, listId);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: listDetailQK, exact: true }),
        queryClient.cancelQueries({ queryKey: groupListsQK, exact: true }),
      ]);

      const prevListDetail = queryClient.getQueryData<List>(listDetailQK);
      const prevGroupLists = queryClient.getQueryData<List[]>(groupListsQK);

      queryClient.setQueryData<List>(listDetailQK, (old) => {
        if (!old) return old;

        return {
          ...old,
          title: newTitle,
        };
      });

      queryClient.setQueryData<List[]>(groupListsQK, (old) => {
        if (!old) return old;

        return old.map((list) => (list.id === listId ? { ...list, title: newTitle } : list));
      });

      return { listDetailQK, groupListsQK, prevListDetail, prevGroupLists };
    },

    onSuccess: (data, { listId }, context) => {
      queryClient.setQueryData<List>(context.listDetailQK, (old) => {
        if (!old) return old;
        return { ...old, title: data.title };
      });

      queryClient.setQueryData<List[]>(context.groupListsQK, (old) => {
        if (!old) return old;
        return old.map((list) => (list.id === listId ? { ...list, title: data.title } : list));
      });
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      queryClient.setQueryData(context.listDetailQK, context.prevListDetail);
      queryClient.setQueryData(context.groupListsQK, context.prevGroupLists);
    },

    onSettled: (_data, _error, _vars, context) => {
      if (!context) return;
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: context.listDetailQK, exact: true }),
        queryClient.invalidateQueries({ queryKey: context.groupListsQK, exact: true }),
      ]);
    },
  });
}
