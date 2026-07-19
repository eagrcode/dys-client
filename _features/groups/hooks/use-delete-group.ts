import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/_features/groups/groups-api";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import { useGroups } from "@/_features/groups/hooks/use-groups";
import { useRouter } from "expo-router";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import type { DeleteGroupResponse, Group } from "@/_features/groups/groups-types";
import { ApiErrorResponse } from "@/_shared/types/api-error";

type Props = {
  groupId: string;
};

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  const { selectGroup } = useGroupsProvider();
  const { data: groups = [] } = useGroups();
  const router = useRouter();
  const { user } = useAuthProvider();
  const groupsQueryKey = ["groups", user?.id] as const;

  return useMutation<DeleteGroupResponse, ApiErrorResponse, Props>({
    mutationFn: ({ groupId }) => groupsAPI.deleteGroup(groupId),
    onSuccess: async (res) => {
      const deletedGroupId = res.id;
      queryClient.setQueryData<Group[]>(groupsQueryKey, (old = []) =>
        old.filter((group) => group.id !== res.id),
      );

      const remaining = groups.filter((g: any) => g.id !== deletedGroupId);

      if (remaining.length > 0) {
        selectGroup(remaining[0].id);
      } else {
        selectGroup(null);
      }
      router.replace("/");
    },
  });
}
