import { useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/_features/groups/groups-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import type { Group } from "@/_features/groups/groups-types";
import { log } from "@/_shared/logger/logger";

export function useGroups() {
  const { user, isLoading: authLoading } = useAuthProvider();

  return useQuery<Group[]>({
    queryKey: ["groups", user?.id],
    queryFn: async () => {
      log.info("useGroups | Firing query", { userId: user?.id });
      const response = await groupsAPI.getUserGroups();
      return response ?? [];
    },
    enabled: !!user?.id && !authLoading,
    staleTime: 5 * 60 * 1000,
  });
}
