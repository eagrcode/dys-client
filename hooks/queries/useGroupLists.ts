import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export function useGroupLists(groupId: string) {
  const { user } = useAuthProvider();

  return useQuery({
    queryKey: ["groupLists", user?.id, groupId],
    queryFn: async () => {
      console.log("useGroupLists | Firing query", { userId: user?.id, groupId });
      if (!user?.id) return [];
      const response = await listsAPI.getGroupLists(groupId);
      return response.data || [];
    },
    enabled: !!user?.id && !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
