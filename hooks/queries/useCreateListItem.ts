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
      const queryKey = ["list", user?.id, selectedGroup, listId];
      await queryClient.cancelQueries({ queryKey });

      const prevList = queryClient.getQueryData(queryKey);
      console.log("prevList exists:", !!prevList);

      queryClient.setQueryData(queryKey, (old: any = {}) => ({
        ...old,
        items: [
          {
            id: `temp-${Date.now()}`,
            content,
            completed: false,
            created_at: new Date().toISOString(),
          },
          ...(old?.items ?? []),
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
