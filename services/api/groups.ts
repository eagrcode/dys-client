import { apiCall } from "@/utils/apiCall";
import type { Group, DeleteGroupResponse } from "@/utils/types/T_Groups";

export const groupsAPI = {
  getUserGroups: async (): Promise<Group[]> => {
    const response = await apiCall(`/groups`, "GET");
    return response.data;
  },

  createGroup: async (name: string, description: string): Promise<Group> => {
    const response = await apiCall(`/groups`, "POST", {
      body: JSON.stringify({ name, description }),
    });
    return response.data;
  },

  getGroupById: async (groupId: string): Promise<Group> => {
    const response = await apiCall(`/groups/${groupId}`, "GET");
    return response.data;
  },

  deleteGroup: async (groupId: string): Promise<DeleteGroupResponse> => {
    const response = await apiCall(`/groups/${groupId}`, "DELETE");
    return response.data;
  },
};
