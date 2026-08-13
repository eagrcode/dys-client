import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/_features/groups/groups-api";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import { useGroups } from "@/_features/groups/hooks/use-groups";
import { groupKeys } from "@/_features/groups/qk.groups";
import { useRouter } from "expo-router";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import type { Group } from "@/_features/groups/types/t-group";
import type { DeleteGroup } from "@/_features/groups/types/t-groups-api";
import type { ApiError } from "@/_shared/types/api-error";

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  const { selectGroup } = useGroupsProvider();
  const { data: groups = [] } = useGroups();
  const router = useRouter();
  const { user } = useAuthProvider();
  const groupsQueryKey = groupKeys.all(user?.id ?? "");

  return useMutation<DeleteGroup.Response, ApiError, DeleteGroup.Request>({
    mutationFn: (req) => groupsAPI.deleteGroup(req),
    onSuccess: async (res) => {
      const deletedGroupId = res.id;
      queryClient.setQueryData<Group[]>(groupsQueryKey, (old = []) =>
        old.filter((group) => group.id !== res.id),
      );

      const remaining = groups.filter((group) => group.id !== deletedGroupId);

      if (remaining.length > 0) {
        selectGroup(remaining[0].id);
      }
      router.replace("/");
    },
  });
}
