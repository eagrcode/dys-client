import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/_features/groups/groups-api";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import { useRouter } from "expo-router";
import { groupKeys } from "../qk.groups";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import type { ApiError } from "@/_shared/types/api-error";
import type { Group } from "@/_features/groups/groups-types";

type Props = {
  name: string;
  description: string;
};

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const { selectGroup } = useGroupsProvider();
  const { user } = useAuthProvider();
  const router = useRouter();

  return useMutation<Group, ApiError, Props>({
    mutationFn: ({ name, description }) => groupsAPI.createGroup(name, description),
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
