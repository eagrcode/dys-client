import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/features/lists/api/lists-api";
import { listKeys } from "@/features/lists/queries/list-keys.ts";
import { useStoredGroupId } from "@/shared/hooks/use-stored-group-id";
import type { ApiError } from "@/shared/api/api-error";
import type { List } from "@/features/lists/types/t-list";
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
