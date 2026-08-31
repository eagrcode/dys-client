import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { listsAPI } from "@/features/lists/api/lists-api";
import { listKeys } from "@/features/lists/queries/list-keys";
import { useStoredGroupId } from "@/shared/hooks/use-stored-group-id";
import type { ListType } from "@/features/lists/constants/list-types-config";
import type { ApiError } from "@/shared/api/api-error";
import type { CreateList } from "@/features/lists/types/t-lists-api";

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
