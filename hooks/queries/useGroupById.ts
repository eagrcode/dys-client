import { useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/services/api/groups";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export function useGroupById(groupId: string) {
  const { user } = useAuthProvider();

  return useQuery({
    queryKey: ["groupId", user?.id, groupId],
    queryFn: async () => {
      console.log("useGroupById | Firing query", { userId: user?.id, groupId });
      if (!user?.id) return [];
      const response = await groupsAPI.getGroupById(groupId);
      return response.data || [];
    },
    enabled: !!user?.id && !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
