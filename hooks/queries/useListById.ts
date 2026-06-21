import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export function useListById(groupId: string, listId: string) {
  const { user } = useAuthProvider();

  return useQuery({
    queryKey: ["list", user?.id, groupId, listId],
    queryFn: async () => {
      return await listsAPI.getListById(groupId, listId);
    },
    enabled: !!user?.id && !!groupId && !!listId,
    staleTime: 5 * 60 * 1000,
  });
}
