import { useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/services/api/groups";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import type { Group } from "@/utils/types/T_Groups";

export function useGroups() {
  const { user } = useAuthProvider();

  return useQuery<Group[]>({
    queryKey: ["groups", user?.id],
    queryFn: async () => {
      console.log("useGroups | Firing query", { userId: user?.id });
      const response = await groupsAPI.getUserGroups();
      return response ?? [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}
