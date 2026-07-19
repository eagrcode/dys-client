import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/_features/groups/groups-api";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import { useRouter } from "expo-router";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { ApiErrorResponse } from "@/_shared/types/api-error";
import type { Group } from "@/_features/groups/groups-types";

type Props = {
  name: string;
  description: string;
};

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const { selectGroup } = useGroupsProvider();
  const router = useRouter();
  const { user } = useAuthProvider();
  const groupsQueryKey = ["groups", user?.id] as const;

  return useMutation<Group, ApiErrorResponse, Props>({
    mutationFn: ({ name, description }) => groupsAPI.createGroup(name, description),
    onSuccess: async (createdGroup) => {
      queryClient.setQueryData<Group[]>(groupsQueryKey, (old = []) => [...old, createdGroup]);

      await selectGroup(createdGroup.id);

      if (router.canDismiss()) {
        router.dismissAll();
      } else {
        router.replace("/");
      }
    },
  });
}
