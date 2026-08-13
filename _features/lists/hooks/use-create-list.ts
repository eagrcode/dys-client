import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { listsAPI } from "@/_features/lists/lists-api";
import { listKeys } from "@/_features/lists/qk.lists";
import { useStoredGroupId } from "@/_shared/hooks/use-stored-group-id";
import type { ListType } from "@/_features/lists/constants/list-types-config";
import type { ApiError } from "@/_shared/types/api-error";
import type { CreateList } from "@/_features/lists/types/t-lists-api";

type Vars = {
  title: string;
  listType: ListType;
};

export function useCreateList() {
  const queryClient = useQueryClient();
  const storedGroupId = useStoredGroupId();
  const router = useRouter();

  return useMutation<CreateList.Response, ApiError, Vars>({
    mutationFn: ({ title, listType }) => {
      return listsAPI.createList({
        groupId: storedGroupId,
        data: {
          title: title,
          listType: listType,
        },
      });
    },

    onSuccess: async () => {
      const listQK = listKeys.group(storedGroupId);
      const dashboardQK = listKeys.dashboard(storedGroupId);

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
