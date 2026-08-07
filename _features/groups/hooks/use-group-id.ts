import { queryOptions, useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/_features/groups/groups-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import { groupKeys } from "@/_features/groups/qk.groups";
import type { Group } from "@/_features/groups/groups-types";
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
  return queryOptions<Group, ApiError>({
    queryKey: groupKeys.detail(userId, groupId),
    queryFn: () => groupsAPI.getGroupById(groupId),
    staleTime: 5 * 60 * 1000,
  });
}
