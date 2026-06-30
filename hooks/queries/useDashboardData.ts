import { useQueries } from "@tanstack/react-query";
import { dashboardApi } from "@/services/api/dashboard";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";

const STALE_TIME = 5 * 60 * 1000;

export function useDashboardData() {
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();
  const userId = user?.id;
  const enabled = !!userId && !!selectedGroup;

  const options = {
    enabled,
    staleTime: STALE_TIME,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  };

  const [lists, calendar, albums, messages] = useQueries({
    queries: [
      {
        queryKey: ["dashboardData", userId, selectedGroup, "lists"],
        queryFn: () => dashboardApi.getLists(selectedGroup || ""),
        ...options,
      },
      {
        queryKey: ["dashboardData", userId, selectedGroup, "calendar"],
        queryFn: () => dashboardApi.getCalendar(selectedGroup || ""),
        ...options,
      },
      {
        queryKey: ["dashboardData", userId, selectedGroup, "albums"],
        queryFn: () => dashboardApi.getAlbums(selectedGroup || ""),
        ...options,
      },
      {
        queryKey: ["dashboardData", userId, selectedGroup, "messages"],
        queryFn: () => dashboardApi.getMessages(selectedGroup || ""),
        ...options,
      },
    ],
  });

  const dashboardQueries = [lists, calendar, albums, messages];
  const isInitialSettled = dashboardQueries.every((query) => query.isSuccess || query.isError);

  return {
    lists,
    calendar,
    albums,
    messages,

    isInitialSettled,

    isFetching: dashboardQueries.some((query) => query.isFetching),
    hasError: dashboardQueries.some((query) => query.isError),
  };
}
