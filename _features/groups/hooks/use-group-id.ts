import { queryOptions, useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/_features/groups/groups-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import { groupKeys } from "@/_features/groups/qk.groups";
import { QUERY_TIMES } from "@/_shared/config/query-policy";
import type { GetGroupById } from "@/_features/groups/types/t-groups-api";
import type { ApiError } from "@/_shared/types/api-error";

export function useGroupById(groupId?: string) {
  const { user } = useAuthProvider();
  const { storedGroupId } = useGroupsProvider();

  const userId = user?.id ?? "";
  const resolvedGroupId = groupId ?? storedGroupId ?? "";

  return useQuery({
    ...groupByIdQueryOptions(userId, resolvedGroupId),
    enabled: !!userId && !!resolvedGroupId,
  });
}

export function groupByIdQueryOptions(userId: string, groupId: string) {
  return queryOptions<GetGroupById.Response, ApiError>({
    queryKey: groupKeys.detail(userId, groupId),
    queryFn: () => groupsAPI.getGroupById({ groupId }),
    staleTime: QUERY_TIMES.groups.staleTime,
    gcTime: QUERY_TIMES.groups.gcTime,
  });
}
