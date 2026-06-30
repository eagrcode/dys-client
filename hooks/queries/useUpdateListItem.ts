import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import type { ListItem, List } from "@/utils/types/T_Lists";
import type { ApiErrorResponse } from "@/utils/types/ApiError";

type Props = {
  listId: string;
  itemId: string;
  content: string;
};

type UpdateListItemContext = {
  queryKey: readonly unknown[];
  prevList: List | undefined;
};

export function useUpdateListItem() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();
  const userId = user?.id;

  return useMutation<any, ApiErrorResponse, Props, UpdateListItemContext>({
    mutationFn: ({ listId, itemId, content }) => {
      if (!selectedGroup) throw new Error("No group selected");
      return listsAPI.updateListItem(selectedGroup, listId, itemId, content);
    },

    onMutate: async ({ listId, itemId, content }) => {
      const queryKey = ["list", userId, selectedGroup, listId] as const;

      await queryClient.cancelQueries({ queryKey });

      const prevList = queryClient.getQueryData<List>(queryKey);
      console.log("prevList exists:", !!prevList);

      queryClient.setQueryData<List>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items?.map((item) =>
            item.id === itemId ? { ...item, content, updated_at: new Date().toISOString() } : item,
          ),
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
