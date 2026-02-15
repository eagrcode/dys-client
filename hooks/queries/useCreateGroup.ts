import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/services/api/groups";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useRouter } from "expo-router";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { ApiErrorResponse } from "@/utils/types/ApiError";
import { CreateGroup } from "@/utils/types/CreateGroup";

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const { selectGroup } = useGroupsProvider();
  const router = useRouter();
  const { user } = useAuthProvider();

  return useMutation<CreateGroup, ApiErrorResponse, { name: string; description: string }>({
    mutationFn: ({ name, description }: { name: string; description: string }) =>
      groupsAPI.createGroup(name, description),
    onSuccess: async (res) => {
      await queryClient.refetchQueries({ queryKey: ["groups", user?.id], type: "all" });
      selectGroup(res.data);
      router.replace("/");
    },
  });
}
