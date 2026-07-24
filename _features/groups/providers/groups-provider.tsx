import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useGroups } from "@/_features/groups/hooks/use-groups";
import { log } from "@/_shared/logger/logger";
import type { Group } from "../groups-types";
import { useQueryClient } from "@tanstack/react-query";
import { useGroupKeys } from "../qk.groups";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";

type SelectedGroup = string | null;

type GroupContext = {
  selectedGroup: SelectedGroup;
  selectGroup: (groupId: string) => Promise<void>;
  isLoading: boolean;
};

const GroupsContext = createContext<GroupContext | undefined>(undefined);

export const GroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReconciling, setIsReconciling] = useState<boolean>(true);
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup>(null);
  const queryClient = useQueryClient();
  const groupKeys = useGroupKeys();
  const { user } = useAuthProvider();
  const {
    data: userGroups = [],
    isLoading: groupsLoading,
    isError: isUserGroupsError,
    isSuccess: isUserGroupsSuccess,
  } = useGroups();

  const userHasGroup = (groupId: string | null) => {
    return groupId !== null && userGroups.some((group) => group.id === groupId);
  };

  const selectGroup = async (groupId: string) => {
    log.info("GroupsProvider | selectGroup - called with ID:", groupId);

    const latestGroups = queryClient.getQueryData<Group[]>(groupKeys.all()) || [];
    const groupExists = latestGroups.some((group) => group.id === groupId);

    if (!groupExists) {
      log.error(
        "GroupsProvider | selectGroup - group does not exist in user groups:",
        JSON.stringify(
          {
            latestGroups: latestGroups,
            groupId: groupId,
          },
          null,
          2,
        ),
      );
      throw new Error("Group does not exist in user groups");
    }

    try {
      await SecureStore.setItemAsync("selectedGroup", groupId);
      setSelectedGroup(groupId);

      log.info(
        "GroupsProvider | selectGroup - group selected successfully:",
        JSON.stringify(groupId, null, 2),
      );
    } catch (error) {
      log.error("GroupsProvider | selectGroup - error persisting selected group:", error);
      throw new Error("Failed to persist selected group", { cause: error });
    }
  };

  // Determine if the selected group matches an existing entry in the user groups
  const selectedGroupIsValid = userHasGroup(selectedGroup);

  // Determine if the user has no groups
  const userHasNoGroups = userGroups.length === 0;

  // Determine if the selected group matches an existing entry in the user groups or is null when the user has no groups
  const selectionMatchesGroups = userHasNoGroups ? selectedGroup === null : selectedGroupIsValid;

  const isProviderReady = isUserGroupsSuccess && !isReconciling && selectionMatchesGroups;
  const isProviderLoading = !isProviderReady && !isUserGroupsError;

  const firstGroup = userGroups[0]?.id;

  useEffect(() => {
    reconcileSelectedGroup();
  }, [groupsLoading, userGroups, isUserGroupsError, isUserGroupsSuccess, firstGroup]);

  const reconcileSelectedGroup = async () => {
    if (!user) {
      log.warn("GroupsProvider | No authenticated user found, cannot reconcile selected group");
      return;
    }

    log.info("GroupsProvider | Running pre-checks for selected group reconciliation...");

    if (groupsLoading) {
      log.info("GroupsProvider | Groups are still loading, waiting...");
      setIsReconciling(true);
      return;
    }

    if (isUserGroupsError) {
      log.error("GroupsProvider | Failed to load user groups, cannot reconcile selected group");
      setIsReconciling(false);
      return;
    }

    if (!isUserGroupsSuccess) {
      log.info("GroupsProvider | User groups not yet loaded, waiting...");
      return;
    }

    // If the user has no groups, clear the selected group and clean up secure storage
    if (userHasNoGroups) {
      log.info("GroupsProvider | No user groups found, running cleanup...");

      try {
        await SecureStore.deleteItemAsync("selectedGroup");
      } catch (error) {
        log.error("GroupsProvider | Failed to clean up selected group:", error);
      } finally {
        setSelectedGroup(null);
        setIsReconciling(false);
      }

      log.info(
        "GroupsProvider | Cleanup complete:",
        JSON.stringify(
          {
            userGroups,
            selectedGroup: null,
          },
          null,
          2,
        ),
      );
      return;
    }

    // If the selected group is valid, no reconciliation is needed
    if (selectedGroupIsValid) {
      log.info("GroupsProvider | Current selected group is valid, no reconciliation required.");
      setIsReconciling(false);
      return;
    }

    log.info("GroupsProvider | Groups found but no selected group, reconciling...");
    try {
      setIsReconciling(true);

      const storedGroup = await SecureStore.getItemAsync("selectedGroup");

      if (storedGroup) {
        log.info(
          "GroupsProvider | Found stored group in secure storage:",
          JSON.stringify(storedGroup, null, 2),
        );

        // Does the stored group exist in the user's groups?
        const groupExists = userHasGroup(storedGroup);

        // If not, select the first available group and update secure storage
        if (!groupExists) {
          log.warn(
            "GroupsProvider | Stored group does not exist in user groups, setting first available group...",
            JSON.stringify(storedGroup, null, 2),
          );

          await selectGroup(firstGroup);

          log.info(
            "GroupsProvider | Selected first available group:",
            JSON.stringify(
              {
                userGroups,
                selectedGroup: firstGroup,
              },
              null,
              2,
            ),
          );
        } else {
          // If it does exist, select the stored group
          log.info(
            "GroupsProvider | Stored group exists in user groups, selecting stored group...",
            JSON.stringify(storedGroup, null, 2),
          );
          setSelectedGroup(storedGroup);
        }
      } else {
        // If no stored group is found, select the first available group
        log.info(
          "GroupsProvider | No stored group found, selecting first available group...",
          JSON.stringify(firstGroup, null, 2),
        );
        await selectGroup(firstGroup);
      }
    } catch (error) {
      // If any error occurs during the reconciliation process, select the first available group
      log.error(
        "GroupsProvider | Failed to load selected group, fallback to first available group without persisting:",
        error,
      );
      setSelectedGroup(firstGroup);
    } finally {
      setIsReconciling(false);
      log.info("GroupsProvider | Finished initialising current group");
    }
  };

  return (
    <GroupsContext.Provider value={{ selectedGroup, selectGroup, isLoading: isProviderLoading }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroupsProvider = () => {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error("useGroupsProvider must be used within a GroupsProvider");
  }
  return context;
};
