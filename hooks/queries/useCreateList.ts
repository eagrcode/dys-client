import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { ApiErrorResponse } from "@/utils/types/ApiError";
import { useRouter } from "expo-router";

export function useCreateList() {
  const queryClient = useQueryClient();
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();
  const router = useRouter();

  return useMutation<
    any,
    ApiErrorResponse,
    { title: string; listType: string; itemsArr?: string[] }
  >({
    mutationFn: ({ title, listType, itemsArr = [] }) => {
      console.log("useCreateList | Firing mutation...");
      if (!selectedGroup) throw new Error("No group selected");
      return listsAPI.createList(selectedGroup, { title, listType, itemsArr });
    },
    onSuccess: (response) => {
      queryClient.setQueryData(["groupLists", user?.id, selectedGroup], (old: any[] = []) => [
        ...old,
        response.data,
      ]);
      router.back();
    },
  });
}
