import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/features/groups/api/groups-api";
import { useGroupsProvider } from "@/features/groups/providers/groups-provider";
import { useRouter } from "expo-router";
import { groupKeys } from "../queries/group-keys.ts";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import type { ApiError } from "@/shared/api/api-error";
import type { Group } from "@/features/groups/types/t-group";
import type { CreateGroup } from "@/features/groups/types/t-groups-api";

type Props = CreateGroup.Request["data"];

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const { selectGroup } = useGroupsProvider();
  const { user } = useAuthProvider();
  const router = useRouter();

  return useMutation<CreateGroup.Response, ApiError, Props>({
    mutationFn: ({ name, description }) =>
      groupsAPI.createGroup({
        data: { name, description },
      }),
    onSuccess: async (createdGroup) => {
      const userID = user?.id ?? "";

      queryClient.setQueryData<Group[]>(groupKeys.all(userID), (old = []) => [
        ...old,
        createdGroup,
      ]);

      await selectGroup(createdGroup.id);

      router.navigate("/");
    },
  });
}
