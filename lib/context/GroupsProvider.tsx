import React, { createContext, use, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useGroups } from "@/hooks/queries/useGroups";

type GroupContext = {
  selectedGroup: string | null;
  selectGroup: (groupId: string | null) => Promise<void>;
  isLoading: boolean;
};

const GroupsContext = createContext<GroupContext | undefined>(undefined);

export const GroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const { data: userGroups = [], isLoading: groupsLoading } = useGroups();

  useEffect(() => {
    if (groupsLoading) return;

    const initCurrentGroup = async () => {
      console.log("GroupsProvider | Initialising current group...");
      try {
        const storedGroupJson = await SecureStore.getItemAsync("selectedGroup");
        if (storedGroupJson) {
          console.log("GroupsProvider | Found stored group in secure storage:", storedGroupJson);
          setSelectedGroup(JSON.parse(storedGroupJson));
        } else if (userGroups.length > 0) {
          console.log("GroupsProvider | No stored group, selecting first group:", userGroups[0].id);
          await selectGroup(userGroups[0].id);
        } else {
          console.log("GroupsProvider | No stored group and no groups available.");
        }
      } catch (error) {
        console.error("GroupsProvider | Failed to load selected group:", error);
      } finally {
        setIsLoading(false);
        console.log("GroupsProvider | Finished initialising current group.");
      }
    };

    initCurrentGroup();
  }, [groupsLoading]);

  const selectGroup = async (groupId: string | null) => {
    console.log("GroupsProvider | Selecting group:", groupId);
    setSelectedGroup(groupId);
    if (groupId) {
      await SecureStore.setItemAsync("selectedGroup", JSON.stringify(groupId));
    } else {
      await SecureStore.deleteItemAsync("selectedGroup");
    }
  };

  return (
    <GroupsContext.Provider value={{ selectedGroup, selectGroup, isLoading }}>
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
