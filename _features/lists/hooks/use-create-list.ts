import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { listsAPI } from "@/_features/lists/lists-api";
import { listKeys } from "@/_features/lists/qk.lists";
import { useSelectedGroup } from "@/_shared/hooks/use-selected-group";
import type { List, ListType } from "@/_features/lists/lists-types";
import type { ApiError } from "@/_shared/types/api-error";

type Vars = {
  title: string;
  listType: ListType;
};

export function useCreateList() {
  const queryClient = useQueryClient();
  const selectedGroup = useSelectedGroup();
  const router = useRouter();

  return useMutation<List, ApiError, Vars>({
    mutationFn: ({ title, listType }) => {
      return listsAPI.createList(selectedGroup, {
        title,
        listType,
      });
    },

    onSuccess: async () => {
      const listQK = listKeys.group(selectedGroup);
      const dashboardQK = listKeys.dashboard(selectedGroup);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: listQK,
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardQK,
        }),
      ]);

      router.back();
    },
  });
}
