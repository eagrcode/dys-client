import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/services/api/groups";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useRouter } from "expo-router";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { ApiErrorResponse } from "@/utils/types/ApiError";
import type { Group } from "@/utils/types/T_Groups";

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
