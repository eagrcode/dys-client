import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/services/api/groups";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useGroups } from "@/hooks/queries/useGroups";
import { useRouter } from "expo-router";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import type { DeleteGroupResponse, Group } from "@/utils/types/T_Groups";
import { ApiErrorResponse } from "@/utils/types/ApiError";

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
