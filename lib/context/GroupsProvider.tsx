import React, { createContext, use, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./SessionProvider";
import { groupsAPI } from "@/services/api/groups";
import * as SecureStore from "expo-secure-store";

type GroupContext = {
  selectedGroup: any;
  setSelectedGroup: React.Dispatch<React.SetStateAction<any>>;
  switchGroup: (groupId: string) => Promise<void>;
};

const GroupsContext = createContext<GroupContext | undefined>(undefined);

export const GroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const { user } = useAuthProvider();

  useEffect(() => {
    initCurrentGroup();
  }, []);

  const initCurrentGroup = async () => {
    try {
      const storedGroupJson = await SecureStore.getItemAsync("selectedGroup");
      if (storedGroupJson) {
        setSelectedGroup(JSON.parse(storedGroupJson));
      }
    } catch (error) {
      console.error("Failed to load selected group:", error);
    }
  };

  const switchGroup = async (group: any) => {
    setSelectedGroup(group);
    await SecureStore.setItemAsync("selectedGroup", JSON.stringify(group));
  };

  return (
    <GroupsContext.Provider value={{ selectedGroup, setSelectedGroup, switchGroup }}>
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
