import { apiCall } from "@/utils/apiCall";
import { List, ListType } from "@/utils/types/T_Lists";

const BASE_URL = `/groups`;

type ToggleCompleteListItem = {
  groupId: string;
  listId: string;
  itemId: string;
  completed: boolean;
};

export const listsAPI = {
  getGroupLists: async (groupId: string): Promise<List[]> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/lists`, "GET");
    return response.data;
  },

  createList: async (
    groupId: string,
    data: { title: string; listType: ListType; itemsArr?: string[] },
  ) => {
    return await apiCall(`${BASE_URL}/${groupId}/lists`, "POST", {
      body: JSON.stringify(data),
    });
  },

  getListById: async (groupId: string, listId: string): Promise<List> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/lists/${listId}`, "GET");
    return response.data;
  },

  deleteList: async (groupId: string, listId: string) => {
    return await apiCall(`${BASE_URL}/${groupId}/lists/${listId}`, "DELETE");
  },

  createListItem: async (groupId: string, listId: string, content: string) => {
    return await apiCall(`${BASE_URL}/${groupId}/lists/${listId}/items`, "POST", {
      body: JSON.stringify({ content }),
    });
  },

  toggleCompleteListItem: async ({
    groupId,
    listId,
    itemId,
    completed,
  }: ToggleCompleteListItem) => {
    return await apiCall(`${BASE_URL}/${groupId}/lists/${listId}/items/${itemId}/toggle`, "PATCH", {
      body: JSON.stringify({ completed }),
    });
  },
};
