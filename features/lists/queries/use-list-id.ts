import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/features/lists/api/lists-api";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { listKeys } from "@/features/lists/queries/list-keys.ts";
import { useStoredGroupId } from "@/shared/hooks/use-stored-group-id";
import type { ApiError } from "@/shared/api/api-error";
import { GetListById } from "../types/t-lists-api";
import { QUERY_TIMES } from "@/shared/config/query-policy";

export function useListById(listId: string) {
  const { user } = useAuthProvider();
  const storedGroupId = useStoredGroupId();
  const userId = user?.id;
  const queryKey = listKeys.detail(storedGroupId, listId);
  const enabled = !!userId && !!storedGroupId && !!listId;

  return useQuery<GetListById.Response, ApiError>({
    queryKey: queryKey,
    queryFn: async () => {
      return await listsAPI.getListById({
        groupId: storedGroupId,
        listId: listId,
      });
    },
    enabled: enabled,
    staleTime: QUERY_TIMES.lists.staleTime,
    gcTime: QUERY_TIMES.lists.gcTime,
  });
}
