import { useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/services/api/groups";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import type { Group } from "@/utils/types/T_Groups";

export function useGroupById() {
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();

  const queryKey = ["group", user?.id, selectedGroup];
  const options = {
    enabled: !!user?.id && !!selectedGroup,
    staleTime: 5 * 60 * 1000,
  };

  return useQuery<Group>({
    queryKey: queryKey,
    queryFn: async () => {
      console.log("useGroupById | Firing query", { userId: user?.id, selectedGroup });
      return await groupsAPI.getGroupById(selectedGroup || "");
    },
    ...options,
  });
}
