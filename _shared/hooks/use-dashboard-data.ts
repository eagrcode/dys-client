import { useQueries } from "@tanstack/react-query";
import { dashboardApi } from "@/_shared/api/dashboard-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import { listKeys } from "@/_features/lists/qk.lists";

const STALE_TIME = 5 * 60 * 1000;

export function useDashboardData() {
  const { user } = useAuthProvider();
  const { storedGroupId } = useGroupsProvider();
  const userId = user?.id;
  const enabled = !!userId && !!storedGroupId;

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
        queryKey: listKeys.dashboard(storedGroupId || ""),
        queryFn: () => dashboardApi.getLists(storedGroupId || ""),
        ...options,
      },
      {
        queryKey: ["dashboardData", userId, storedGroupId, "calendar"],
        queryFn: () => dashboardApi.getCalendar(storedGroupId || ""),
        ...options,
      },
      {
        queryKey: ["dashboardData", userId, storedGroupId, "albums"],
        queryFn: () => dashboardApi.getAlbums(storedGroupId || ""),
        ...options,
      },
      {
        queryKey: ["dashboardData", userId, storedGroupId, "messages"],
        queryFn: () => dashboardApi.getMessages(storedGroupId || ""),
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
