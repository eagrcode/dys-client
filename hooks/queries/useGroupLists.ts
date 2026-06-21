import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export function useGroupLists(groupId: string) {
  const { user } = useAuthProvider();
  const userId = user?.id;
  const queryKey = ["groupLists", userId, groupId];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      console.log("useGroupLists | Firing query", { userId: userId, groupId: groupId });
      return await listsAPI.getGroupLists(groupId);
    },
    enabled: !!user?.id && !!groupId,
    staleTime: 5 * 60 * 1000,
  });
}
