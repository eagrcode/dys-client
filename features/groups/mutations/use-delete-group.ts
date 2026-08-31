import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/features/groups/api/groups-api";
import { useGroupsProvider } from "@/features/groups/providers/groups-provider";
import { useGroups } from "@/features/groups/queries/use-groups";
import { groupKeys } from "@/features/groups/queries/group-keys";
import { useRouter } from "expo-router";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import type { Group } from "@/features/groups/types/t-group";
import type { DeleteGroup } from "@/features/groups/types/t-groups-api";
import type { ApiError } from "@/shared/api/api-error";

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
