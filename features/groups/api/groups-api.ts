import { apiCall } from "@/shared/api/api-call";
import type {
  CreateGroup,
  DeleteGroup,
  GetGroupById,
  GetGroups,
} from "@/features/groups/types/t-groups-api";

const BASE_URL = "/groups";

export const groupsAPI = {
  getUserGroups: async (): Promise<GetGroups.Response> => {
    const response = await apiCall<GetGroups.Response>(BASE_URL, "GET");
    return response;
  },

  createGroup: async (req: CreateGroup.Request): Promise<CreateGroup.Response> => {
    const { data } = req;
    const response = await apiCall<CreateGroup.Response>(BASE_URL, "POST", {
      body: JSON.stringify(data),
    });
    return response;
  },

  getGroupById: async (req: GetGroupById.Request): Promise<GetGroupById.Response> => {
    const { groupId } = req;
    const response = await apiCall<GetGroupById.Response>(`${BASE_URL}/${groupId}`, "GET");
    return response;
  },

  deleteGroup: async (req: DeleteGroup.Request): Promise<DeleteGroup.Response> => {
    const { groupId } = req;
    const response = await apiCall<DeleteGroup.Response>(`${BASE_URL}/${groupId}`, "DELETE");
    return response;
  },
};
