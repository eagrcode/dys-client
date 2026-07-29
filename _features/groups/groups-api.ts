import { apiCall } from "@/_shared/utils/api-call";
import type { Group, DeleteGroupResponse } from "@/_features/groups/groups-types";

export const groupsAPI = {
  getUserGroups: async (): Promise<Group[]> => {
    const response = await apiCall<Group[]>(`/groups`, "GET");
    return response.data;
  },

  createGroup: async (name: string, description: string): Promise<Group> => {
    const response = await apiCall<Group>(`/groups`, "POST", {
      body: JSON.stringify({ name, description }),
    });
    return response.data;
  },

  getGroupById: async (groupId: string): Promise<Group> => {
    const response = await apiCall<Group>(`/groups/${groupId}`, "GET");
    return response.data;
  },

  deleteGroup: async (groupId: string): Promise<DeleteGroupResponse> => {
    const response = await apiCall<DeleteGroupResponse>(`/groups/${groupId}`, "DELETE");
    return response.data;
  },
};
