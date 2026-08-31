import { useQuery } from "@tanstack/react-query";
import { membersAPI } from "@/features/members/api/members-api";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { QUERY_TIMES } from "@/shared/config/query-policy";
import type { ApiError } from "@/shared/api/api-error";
import { useGroupsProvider } from "@/features/groups/providers/groups-provider";

import { log } from "@/shared/logging/logger";
import type { Member } from "../types/t-members";

export function useGroupMembers(groupId?: string) {
  const { user, isLoading: authLoading } = useAuthProvider();
  const { storedGroupId } = useGroupsProvider();

  const userId = user?.id ?? "";
  const resolvedGroupId = groupId ?? storedGroupId ?? "";

  return useQuery<Member[], ApiError>({
    queryKey: ["group-members", resolvedGroupId],
    queryFn: async () => {
      log.info("useGroupMembers | Firing query", { groupId: resolvedGroupId });
      const response = await membersAPI.getMembers({ groupId: resolvedGroupId });
      return response ?? [];
    },
    enabled: !!userId && !authLoading && !!resolvedGroupId,
    staleTime: QUERY_TIMES.members.staleTime,
    gcTime: QUERY_TIMES.members.gcTime,
  });
}
