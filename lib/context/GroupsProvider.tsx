import React, { createContext, use, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type GroupContext = {
  selectedGroup: string | null;
  selectGroup: (groupId: string | null) => Promise<void>;
  isLoading: boolean;
};

const GroupsContext = createContext<GroupContext | undefined>(undefined);

export const GroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    initCurrentGroup();
  }, []);

  const initCurrentGroup = async () => {
    console.log("GroupsProvider | Initialising current group...");
    try {
      const storedGroupJson = await SecureStore.getItemAsync("selectedGroup");
      if (storedGroupJson) {
        console.log("GroupsProvider | Found stored group in secure storage:", storedGroupJson);
        setSelectedGroup(JSON.parse(storedGroupJson));
      } else {
        console.log("GroupsProvider | No stored group found in secure storage.");
      }
    } catch (error) {
      console.error("GroupsProvider | Failed to load selected group:", error);
    } finally {
      setIsLoading(false);
      console.log("GroupsProvider | Finished initialising current group.");
    }
  };

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
