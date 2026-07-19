import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import type { ListItem, List } from "@/_features/lists/lists-types";
import type { ApiErrorResponse } from "@/_shared/types/api-error";

type Props = {
  listId: string;
  content: string;
};

type CreateListItemContext = {
  queryKey: readonly unknown[];
  prevList: List | undefined;
};

export function useCreateListItem() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();
  const userId = user?.id;

  return useMutation<any, ApiErrorResponse, Props, CreateListItemContext>({
    mutationFn: ({ listId, content }) => {
      if (!selectedGroup) throw new Error("No group selected");
      return listsAPI.createListItem(selectedGroup, listId, content);
    },

    onMutate: async ({ listId, content }) => {
      const queryKey = ["list", userId, selectedGroup, listId] as const;

      await queryClient.cancelQueries({ queryKey });

      const prevList = queryClient.getQueryData<List>(queryKey);
      console.log("prevList exists:", !!prevList);

      queryClient.setQueryData<List>(queryKey, (old) => {
        if (!old) return old;

        const optimisticItem: ListItem = {
          id: `temp-${Date.now()}`,
          list_id: listId,
          content,
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: null,
        };

        return {
          ...old,
          items: [optimisticItem, ...(old.items ?? [])],
        };
      });

      return { queryKey, prevList };
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      queryClient.setQueryData(context.queryKey, context.prevList);
    },

    onSettled: (_data, _error, _vars, context) => {
      if (!context) return;
      queryClient.invalidateQueries({ queryKey: context.queryKey });
    },
  });
}
