import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";

const STALE_TIME = 5 * 60 * 1000;

export function useListById(listId: string) {
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();

  const userId = user?.id;
  const queryKey = ["list", userId, selectedGroup, listId];
  const enabled = !!user?.id && !!selectedGroup && !!listId;

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!selectedGroup) throw new Error("No group selected");
      return await listsAPI.getListById(selectedGroup, listId);
    },
    enabled: enabled,
    staleTime: STALE_TIME,
  });
}
