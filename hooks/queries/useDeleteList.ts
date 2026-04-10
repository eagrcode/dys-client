import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";

export function useDeleteList() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();

  return useMutation<any, Error, string, { prevGroupLists: any[] | undefined }>({
    mutationFn: (listId: string) => {
      if (!selectedGroup) throw new Error("No group selected");
      return listsAPI.deleteList(selectedGroup, listId);
    },

    onMutate: async (listId) => {
      await queryClient.cancelQueries({ queryKey: ["groupLists", user?.id, selectedGroup] });

      const prevGroupLists = queryClient.getQueryData<any[]>([
        "groupLists",
        user?.id,
        selectedGroup,
      ]);

      queryClient.setQueryData(["groupLists", user?.id, selectedGroup], (old: any[] = []) =>
        (old ?? []).filter((list: any) => list.id !== listId),
      );

      return { prevGroupLists };
    },

    onError: (_err, _listId, context) => {
      queryClient.setQueryData(
        ["groupLists", user?.id, selectedGroup],
        context?.prevGroupLists ?? [],
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["groupLists", user?.id, selectedGroup] });
    },
  });
}
