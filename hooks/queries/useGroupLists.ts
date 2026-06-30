import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";

const STALE_TIME = 5 * 60 * 1000;

export function useGroupLists() {
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();
  const userId = user?.id;
  const queryKey = ["groupLists", userId, selectedGroup];
  const enabled = !!user?.id && !!selectedGroup;

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      console.log("useGroupLists | Firing query", { userId: userId, groupId: selectedGroup });
      if (!selectedGroup) throw new Error("No group selected");
      return await listsAPI.getGroupLists(selectedGroup);
    },
    enabled: enabled,
    staleTime: STALE_TIME,
  });
}
