import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";

export function useToggleCompleteListItem() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();

  return useMutation<
    any,
    Error,
    { listId: string; itemId: string; completed: boolean },
    { prevList: any | undefined }
  >({
    mutationFn: ({ listId, itemId, completed }) => {
      if (!selectedGroup) throw new Error("No group selected");
      return listsAPI.toggleCompleteListItem({
        groupId: selectedGroup,
        listId,
        itemId,
        completed,
      });
    },

    onMutate: async ({ listId, itemId, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["list", user?.id, selectedGroup, listId] });

      const prevList = queryClient.getQueryData(["list", user?.id, selectedGroup, listId]);

      queryClient.setQueryData(["list", user?.id, selectedGroup, listId], (old: any = {}) => ({
        ...old,
        items:
          old?.items?.map((item: any) => (item.id === itemId ? { ...item, completed } : item)) ??
          [],
      }));

      return { prevList };
    },

    onError: (_err, { listId }, context) => {
      queryClient.setQueryData(["list", user?.id, selectedGroup, listId], context?.prevList);
    },

    onSettled: (_data, _error, { listId }) => {
      //   queryClient.invalidateQueries({ queryKey: ["list", user?.id, selectedGroup, listId] });
      queryClient.invalidateQueries({ queryKey: ["groupLists", user?.id, selectedGroup] });
    },
  });
}
