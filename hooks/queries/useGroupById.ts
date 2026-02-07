import { useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/services/api/groups";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";

export function useGroupById(groupId: string) {
  const { user } = useAuthProvider();

  return useQuery({
    queryKey: ["groupId", user?.id, groupId],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await groupsAPI.getGroupById(groupId);
      return response.data || [];
    },
    enabled: !!user?.id,
  });
}
