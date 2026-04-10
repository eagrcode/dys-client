import { apiCall } from "@/utils/apiCall";

const BASE_URL = `/groups`;

type ToggleCompleteListItem = {
  groupId: string;
  listId: string;
  itemId: string;
  completed: boolean;
};

export const listsAPI = {
  getGroupLists: async (groupId: string) => {
    return await apiCall(`${BASE_URL}/${groupId}/lists`, "GET");
  },

  createList: async (
    groupId: string,
    data: { title: string; listType: string; itemsArr?: string[] },
  ) => {
    return await apiCall(`${BASE_URL}/${groupId}/lists`, "POST", {
      body: JSON.stringify(data),
    });
  },

  getListById: async (groupId: string, listId: string) => {
    return await apiCall(`${BASE_URL}/${groupId}/lists/${listId}`, "GET");
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
