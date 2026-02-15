import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/services/api/groups";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useGroups } from "@/hooks/queries/useGroups";
import { useRouter } from "expo-router";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  const { selectGroup } = useGroupsProvider();
  const { data: groups = [] } = useGroups();
  const router = useRouter();
  const { user } = useAuthProvider();

  return useMutation({
    mutationFn: (groupId: string) => groupsAPI.deleteGroup(groupId),
    onSuccess: async (res, deletedGroupId) => {
      await queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
      queryClient.removeQueries({ queryKey: ["groupId", user?.id, deletedGroupId] });
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
