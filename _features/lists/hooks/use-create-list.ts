import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { listsAPI } from "@/_features/lists/lists-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import type { ApiErrorResponse } from "@/_shared/types/api-error";
import type { List, ListType } from "@/_features/lists/lists-types";

type CreateListVars = {
  title: string;
  listType: ListType;
};

export function useCreateList() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();
  const router = useRouter();
  const userId = user?.id;

  return useMutation<List, ApiErrorResponse, CreateListVars>({
    mutationFn: ({ title, listType }) => {
      if (!selectedGroup) {
        throw new Error("No group selected");
      }

      return listsAPI.createList(selectedGroup, {
        title,
        listType,
      });
    },

    onSuccess: async () => {
      if (!selectedGroup) return;

      const groupListsQueryKey = ["groups", selectedGroup, "lists"] as const;
      const dashboardListsQueryKey = ["dashboardData", userId, selectedGroup, "lists"] as const;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: groupListsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardListsQueryKey,
        }),
      ]);

      router.back();
    },
  });
}
