import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import type { List } from "@/_features/lists/lists-types";
import type { ApiErrorResponse } from "@/_shared/types/api-error";
import type { QueryKey, MutationFunctionContext } from "@tanstack/react-query";

type Vars = {
  listId: string;
  newTitle: string;
};

type Context = {
  queryKey: QueryKey;
  prevList: List | undefined;
};

export function useRenameList() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();
  const userId = user?.id;

  return useMutation<{ title: string }, ApiErrorResponse | Error, Vars, Context>({
    mutationFn: ({ listId, newTitle }) => {
      if (!selectedGroup) throw new Error("No group selected");
      return listsAPI.renameList(selectedGroup, listId, newTitle);
    },

    onMutate: async ({ listId, newTitle }) => {
      const queryKey = ["list", userId, selectedGroup, listId] as const;

      await queryClient.cancelQueries({ queryKey });

      const prevList = queryClient.getQueryData<List>(queryKey);

      queryClient.setQueryData<List>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          title: newTitle,
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
      return queryClient.invalidateQueries({ queryKey: context.queryKey });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupLists", userId, selectedGroup] });
    },
  });
}
