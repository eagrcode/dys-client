import { apiCall } from "@/_shared/utils/api-call";
import type { GetMembers } from "./types/t-members-api";

export const membersAPI = {
  getMembers: async ({ groupId }: GetMembers.Request): Promise<GetMembers.Response> => {
    const response = await apiCall<GetMembers.Response>(`/groups/${groupId}/members`, "GET");
    return response;
  },
};
