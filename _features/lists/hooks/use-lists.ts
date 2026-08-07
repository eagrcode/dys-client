import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { listKeys } from "@/_features/lists/qk.lists";
import { log } from "@/_shared/logger/logger";
import { useStoredGroupId } from "@/_shared/hooks/use-stored-group-id";
import type { ApiError } from "@/_shared/types/api-error";
import type { List } from "@/_features/lists/lists-types";

const STALE_TIME = 5 * 60 * 1000;

export function useGroupLists() {
  const { user } = useAuthProvider();
  const storedGroupId = useStoredGroupId();
  const userId = user?.id;
  const queryKey = listKeys.group(storedGroupId);
  const enabled = !!user?.id && !!storedGroupId;

  return useQuery<List[], ApiError>({
    queryKey: queryKey,
    queryFn: async () => {
      log.info("useGroupLists | Firing query", { userId: userId, groupId: storedGroupId });
      return await listsAPI.getGroupLists(storedGroupId);
    },
    enabled: enabled,
    staleTime: STALE_TIME,
  });
}
