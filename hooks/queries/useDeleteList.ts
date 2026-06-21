import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { List } from "@/utils/types/T_Lists";

export function useDeleteList(groupId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const userId = user?.id;
  const groupListsQK = ["groupLists", userId, groupId];
  const dashboardListsQK = ["dashboardData", userId, groupId, "lists"];

  return useMutation({
    mutationFn: (listId: string) => {
      if (!groupId) throw new Error("No group selected");
      return listsAPI.deleteList(groupId, listId);
    },

    onMutate: async (listId, context) => {
      await context.client.cancelQueries({ queryKey: groupListsQK });

      const prevGroupLists = context.client.getQueryData<List[]>(groupListsQK);

      context.client.setQueryData<List[]>(groupListsQK, (old = []) =>
        old.filter((list) => list.id !== listId),
      );

      return { prevGroupLists };
    },

    onError: (err, newList, onMutateResult, context) => {
      context.client.setQueryData(groupListsQK, onMutateResult?.prevGroupLists);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: groupListsQK });
      queryClient.invalidateQueries({
        queryKey: dashboardListsQK,
      });
    },
  });
}
