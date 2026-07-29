import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { listKeys } from "@/_features/lists/qk.lists";
import { log } from "@/_shared/logger/logger";
import { useSelectedGroup } from "@/_shared/hooks/use-selected-group";
import type { ApiError } from "@/_shared/types/api-error";
import type { List } from "@/_features/lists/lists-types";

const STALE_TIME = 5 * 60 * 1000;

export function useGroupLists() {
  const { user } = useAuthProvider();
  const selectedGroup = useSelectedGroup();
  const userId = user?.id;
  const queryKey = listKeys.group(selectedGroup);
  const enabled = !!user?.id && !!selectedGroup;

  return useQuery<List[], ApiError>({
    queryKey: queryKey,
    queryFn: async () => {
      log.info("useGroupLists | Firing query", { userId: userId, groupId: selectedGroup });
      return await listsAPI.getGroupLists(selectedGroup);
    },
    enabled: enabled,
    staleTime: STALE_TIME,
  });
}
