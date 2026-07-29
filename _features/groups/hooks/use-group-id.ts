import { useQuery } from "@tanstack/react-query";
import { groupsAPI } from "@/_features/groups/groups-api";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import type { Group } from "@/_features/groups/groups-types";
import { log } from "@/_shared/logger/logger";
import type { ApiError } from "@/_shared/types/api-error";

export function useGroupById() {
  const { user } = useAuthProvider();
  const { selectedGroup } = useGroupsProvider();

  const queryKey = ["group", user?.id, selectedGroup];
  const options = {
    enabled: !!user?.id && !!selectedGroup,
    staleTime: 5 * 60 * 1000,
  };

  return useQuery<Group, ApiError>({
    queryKey: queryKey,
    queryFn: async () => {
      log.info("useGroupById | Firing query", { userId: user?.id, selectedGroup });
      return await groupsAPI.getGroupById(selectedGroup || "");
    },
    ...options,
  });
}
