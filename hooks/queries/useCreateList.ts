import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { ApiErrorResponse } from "@/utils/types/ApiError";
import type { List, ListType, ListItem } from "@/utils/types/T_Lists";
import { useRouter } from "expo-router";

type Props = {
  title: string;
  listType: ListType;
};

export function useCreateList() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();
  const router = useRouter();
  const userId = user?.id;
  const queryKey = ["groupLists", userId, selectedGroup] as const;
  const dashboardListsQueryKey = ["dashboardData", userId, selectedGroup, "lists"];

  return useMutation<any, ApiErrorResponse, Props>({
    mutationFn: ({ title, listType }) => {
      console.log("useCreateList | Firing mutation...");
      if (!selectedGroup) throw new Error("No group selected");

      return listsAPI.createList(selectedGroup, { title, listType });
    },
    onSuccess: (newList) => {
      queryClient.setQueryData<List[]>(queryKey, (old = []) => [...old, newList]);

      queryClient.invalidateQueries({
        queryKey: dashboardListsQueryKey,
      });

      router.back();
    },
  });
}
