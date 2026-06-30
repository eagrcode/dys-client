import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import type { ApiErrorResponse } from "@/utils/types/ApiError";
import type { List } from "@/utils/types/T_Lists";

type DeleteListContext = {
  queryKey: readonly unknown[];
  dashboardListsQueryKey: readonly unknown[];
  prevGroupLists: List[] | undefined;
};

export function useDeleteList() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();

  return useMutation<List, ApiErrorResponse, string, DeleteListContext>({
    mutationFn: (listId) => {
      if (!selectedGroup) throw new Error("No group selected");
      return listsAPI.deleteList(selectedGroup, listId);
    },

    onMutate: async (listId) => {
      const queryKey = ["groupLists", user?.id, selectedGroup] as const;
      const dashboardListsQueryKey = ["dashboardData", user?.id, selectedGroup, "lists"] as const;

      await queryClient.cancelQueries({ queryKey });

      const prevGroupLists = queryClient.getQueryData<List[]>(queryKey);

      queryClient.setQueryData<List[]>(queryKey, (old = []) =>
        old.filter((list) => list.id !== listId),
      );

      return { queryKey, dashboardListsQueryKey, prevGroupLists };
    },

    onError: (_err, _listId, context) => {
      if (!context) return;
      queryClient.setQueryData(context.queryKey, context.prevGroupLists);
    },

    onSuccess: (_deletedList, _listId, context) => {
      if (!context) return;

      queryClient.invalidateQueries({ queryKey: context.queryKey });
      queryClient.invalidateQueries({ queryKey: context.dashboardListsQueryKey });
    },
  });
}
