import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { listKeys } from "@/_features/lists/qk.lists";
import { log } from "@/_shared/logger/logger";
import { useStoredGroupId } from "@/_shared/hooks/use-stored-group-id";
import { QUERY_TIMES } from "@/_shared/config/query-policy";
import type { ApiError } from "@/_shared/types/api-error";
import type { GetLists } from "@/_features/lists/types/t-lists-api";

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
