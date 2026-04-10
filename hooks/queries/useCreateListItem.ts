import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";

export function useCreateListItem() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();

  return useMutation<
    any,
    Error,
    { listId: string; content: string },
    { prevList: any | undefined }
  >({
    mutationFn: ({ listId, content }) => {
      if (!selectedGroup) throw new Error("No group selected");
      return listsAPI.createListItem(selectedGroup, listId, content);
    },

    onMutate: async ({ listId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["list", user?.id, selectedGroup, listId] });

      const prevList = queryClient.getQueryData(["list", user?.id, selectedGroup, listId]);

      queryClient.setQueryData(["list", user?.id, selectedGroup, listId], (old: any = {}) => ({
        ...old,
        items: [
          ...(old?.items ?? []),
          {
            id: `temp-${Date.now()}`,
            content,
            completed: false,
            created_at: new Date().toISOString(),
          },
        ],
      }));

      return { prevList };
    },

    onError: (_err, { listId }, context) => {
      queryClient.setQueryData(["list", user?.id, selectedGroup, listId], context?.prevList);
    },

    onSettled: (_data, _error, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["list", user?.id, selectedGroup, listId] });
    },
  });
}
