import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsAPI } from "@/_features/groups/groups-api";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import { useRouter } from "expo-router";
import { ApiErrorResponse } from "@/_shared/types/api-error";
import type { Group } from "@/_features/groups/groups-types";
import { log } from "@/_shared/logger/logger";
import { useGroupKeys } from "../qk.groups";

type Props = {
  name: string;
  description: string;
};

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const { selectGroup } = useGroupsProvider();
  const router = useRouter();
  const groupKeys = useGroupKeys();

  return useMutation<Group, ApiErrorResponse, Props>({
    mutationFn: ({ name, description }) => groupsAPI.createGroup(name, description),
    onSuccess: async (createdGroup) => {
      log.info("useCreateGroup | Group created successfully:", createdGroup);

      queryClient.setQueryData<Group[]>(groupKeys.all(), (old = []) => [...old, createdGroup]);

      await selectGroup(createdGroup.id);

      if (router.canDismiss()) {
        router.dismissAll();
      } else {
        router.replace("/");
      }
    },
  });
}
