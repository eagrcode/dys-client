import { useQuery } from "@tanstack/react-query";
import { listsAPI } from "@/services/api/lists";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export function useListById(groupId: string, listId: string) {
  const { user } = useAuthProvider();

  return useQuery({
    queryKey: ["list", user?.id, groupId, listId],
    queryFn: async () => {
      const response = await listsAPI.getListById(groupId, listId);
      return response.data;
    },
    enabled: !!user?.id && !!groupId && !!listId,
    staleTime: 5 * 60 * 1000,
  });
}
