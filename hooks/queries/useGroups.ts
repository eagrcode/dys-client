import { useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/services/api/groups";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export function useGroups() {
  const { user } = useAuthProvider();

  return useQuery({
    queryKey: ["groups", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await groupsAPI.getUserGroups();
      return response.data || [];
    },
    enabled: !!user?.id,
    initialData: [],
  });
}
