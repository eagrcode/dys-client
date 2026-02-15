import { apiCall } from "@/utils/apiCall";

export const groupsAPI = {
  getUserGroups: async () => {
    return await apiCall(`/groups`, "GET");
  },
  createGroup: async (name: string, description: string) => {
    return await apiCall(`/groups`, "POST", {
      body: JSON.stringify({ name, description }),
    });
  },
  getGroupById: async (groupId: string) => {
    return await apiCall(`/groups/${groupId}`, "GET");
  },
  deleteGroup: async (groupId: string) => {
    return await apiCall(`/groups/${groupId}`, "DELETE");
  },
};
