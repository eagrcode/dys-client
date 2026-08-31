import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/features/lists/api/lists-api";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { listKeys } from "@/features/lists/queries/list-keys.ts";
import { log } from "@/shared/logging/logger";
import { useStoredGroupId } from "@/shared/hooks/use-stored-group-id";
import { QUERY_TIMES } from "@/shared/config/query-policy";
import type { ApiError } from "@/shared/api/api-error";
import type { GetLists } from "@/features/lists/types/t-lists-api";

export function useGroupLists() {
  const { user } = useAuthProvider();
  const storedGroupId = useStoredGroupId();
  const userId = user?.id;
  const queryKey = listKeys.group(storedGroupId);
  const enabled = !!user?.id && !!storedGroupId;

  return useQuery<GetLists.Response, ApiError>({
    queryKey: queryKey,
    queryFn: async () => {
      log.info("useGroupLists | Firing query", { userId: userId, groupId: storedGroupId });
      return await listsAPI.getGroupLists({ groupId: storedGroupId });
    },
    enabled: enabled,
    staleTime: QUERY_TIMES.lists.staleTime,
    gcTime: QUERY_TIMES.lists.gcTime,
  });
}
