import { useQueries } from "@tanstack/react-query";
import { dashboardApi } from "@/services/api/dashboard";
import { useAuthProvider } from "@/lib/context/SessionProvider";

const STALE_TIME = 5 * 60 * 1000;

export function useDashboardData(groupId: string) {
  const { user } = useAuthProvider();
  const userId = user?.id;
  const enabled = !!userId && !!groupId;

  const [lists, calendar, albums, messages] = useQueries({
    queries: [
      {
        queryKey: ["dashboardData", userId, groupId, "lists"],
        queryFn: () => dashboardApi.getLists(groupId),
        enabled,
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["dashboardData", userId, groupId, "calendar"],
        queryFn: () => dashboardApi.getCalendar(groupId),
        enabled,
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["dashboardData", userId, groupId, "albums"],
        queryFn: () => dashboardApi.getAlbums(groupId),
        enabled,
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["dashboardData", userId, groupId, "messages"],
        queryFn: () => dashboardApi.getMessages(groupId),
        enabled,
        staleTime: STALE_TIME,
      },
    ],
  });

  return {
    lists,
    calendar,
    albums,
    messages,
    isLoading: lists.isLoading || calendar.isLoading || albums.isLoading || messages.isLoading,
    isFetching: lists.isFetching || calendar.isFetching || albums.isFetching || messages.isFetching,
    hasError: lists.isError || calendar.isError || albums.isError || messages.isError,
  };
}
