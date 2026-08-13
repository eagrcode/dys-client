import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { listKeys } from "@/_features/lists/qk.lists";
import { useStoredGroupId } from "@/_shared/hooks/use-stored-group-id";
import type { ApiError } from "@/_shared/types/api-error";
import type { List } from "@/_features/lists/types/t-list";
import { DeleteList } from "../types/t-lists-api";

type Vars = string;

type Context = {
  listsQK: readonly unknown[];
  dashboardQK: readonly unknown[];
  prevGroupLists: List[] | undefined;
};

export function useDeleteList() {
  const queryClient = useQueryClient();
  const storedGroupId = useStoredGroupId();

  return useMutation<DeleteList.Response, ApiError, Vars, Context>({
    mutationFn: (listId) => {
      return listsAPI.deleteList({
        groupId: storedGroupId,
        listId,
      });
    },

    onMutate: async (listId) => {
      const listsQK = listKeys.group(storedGroupId);
      const dashboardQK = listKeys.dashboard(storedGroupId);

      await queryClient.cancelQueries({ queryKey: listsQK });
      await queryClient.cancelQueries({ queryKey: dashboardQK });

      const prevGroupLists = queryClient.getQueryData<List[]>(listsQK);

      queryClient.setQueryData<List[]>(listsQK, (old = []) =>
        old.filter((list) => list.id !== listId),
      );

      return { listsQK, dashboardQK, prevGroupLists };
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      queryClient.setQueryData(context.listsQK, context.prevGroupLists);
    },

    onSettled: (_data, _error, _vars, context) => {
      if (!context) return;
      queryClient.invalidateQueries({ queryKey: context.listsQK });
      queryClient.invalidateQueries({ queryKey: context.dashboardQK });
    },
  });
}
