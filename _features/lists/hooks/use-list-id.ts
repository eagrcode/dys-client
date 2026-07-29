import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/_features/lists/lists-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { listKeys } from "@/_features/lists/qk.lists";
import { useSelectedGroup } from "@/_shared/hooks/use-selected-group";
import type { ApiError } from "@/_shared/types/api-error";
import type { List } from "@/_features/lists/lists-types";

const STALE_TIME = 5 * 60 * 1000;

export function useListById(listId: string) {
  const { user } = useAuthProvider();
  const selectedGroup = useSelectedGroup();
  const userId = user?.id;
  const queryKey = listKeys.detail(selectedGroup!, listId);
  const enabled = !!userId && !!selectedGroup && !!listId;

  return useQuery<List, ApiError>({
    queryKey: queryKey,
    queryFn: async () => {
      return await listsAPI.getListById(selectedGroup, listId);
    },
    enabled: enabled,
    staleTime: STALE_TIME,
  });
}
