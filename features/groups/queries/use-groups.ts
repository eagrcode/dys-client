import { useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/features/groups/api/groups-api";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { log } from "@/shared/logging/logger";
import { groupKeys } from "@/features/groups/queries/group-keys.ts";
import { QUERY_TIMES } from "@/shared/config/query-policy";
import type { GetGroups } from "@/features/groups/types/t-groups-api";
import type { ApiError } from "@/shared/api/api-error";

export function useGroups() {
  const { user, isLoading: authLoading } = useAuthProvider();

  return useQuery<GetGroups.Response, ApiError>({
    queryKey: groupKeys.all(user?.id ?? ""),
    queryFn: async () => {
      log.info("useGroups | Firing query", { userId: user?.id });
      const response = await groupsAPI.getUserGroups();
      return response ?? [];
    },
    enabled: !!user?.id && !authLoading,
    staleTime: QUERY_TIMES.groups.staleTime,
    gcTime: QUERY_TIMES.groups.gcTime,
  });
}
