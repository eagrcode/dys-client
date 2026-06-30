import { apiCall } from "@/utils/apiCall";
import type {
  List,
  ListType,
  ListItem,
  ToggleCompleteListItemResponse,
} from "@/utils/types/T_Lists";

const BASE_URL = `/groups`;

type ToggleCompleteListItem = {
  groupId: string;
  listId: string;
  itemId: string;
  completed: boolean;
};

type ToggleCompleteAllListItems = {
  groupId: string;
  listId: string;
  completed: boolean;
};

export const listsAPI = {
  getGroupLists: async (groupId: string): Promise<List[]> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/lists`, "GET");
    return response.data;
  },

  createList: async (
    groupId: string,
    data: { title: string; listType: ListType },
  ): Promise<List> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/lists`, "POST", {
      body: JSON.stringify(data),
    });
    return response.data;
  },

  getListById: async (groupId: string, listId: string): Promise<List> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/lists/${listId}`, "GET");
    return response.data;
  },

  deleteList: async (groupId: string, listId: string) => {
    const response = await apiCall(`${BASE_URL}/${groupId}/lists/${listId}`, "DELETE");
    return response.data;
  },

  createListItem: async (groupId: string, listId: string, content: string): Promise<ListItem> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/lists/${listId}/items`, "POST", {
      body: JSON.stringify({ content }),
    });
    return response.data;
  },

  updateListItem: async (
    groupId: string,
    listId: string,
    itemId: string,
    content: string,
  ): Promise<ListItem> => {
    const respnse = await apiCall(
      `${BASE_URL}/${groupId}/lists/${listId}/items/${itemId}`,
      "PATCH",
      {
        body: JSON.stringify({ content }),
      },
    );

    return respnse.data;
  },

  deleteListItems: async ({
    groupId,
    listId,
    itemIds,
  }: {
    groupId: string;
    listId: string;
    itemIds: string[];
  }): Promise<{ deletedItemIds: string[] }> => {
    const response = await apiCall(
      `${BASE_URL}/${groupId}/lists/${listId}/items/delete`,
      "DELETE",
      {
        body: JSON.stringify({ itemIds }),
      },
    );

    return response.data;
  },

  toggleCompleteListItem: async ({
    groupId,
    listId,
    itemId,
    completed,
  }: ToggleCompleteListItem): Promise<ToggleCompleteListItemResponse> => {
    const response = await apiCall(
      `${BASE_URL}/${groupId}/lists/${listId}/items/${itemId}/toggle`,
      "PATCH",
      {
        body: JSON.stringify({ completed }),
      },
    );

    return response.data;
  },

  toggleCompleteAllListItems: async ({
    groupId,
    listId,
    completed,
  }: ToggleCompleteAllListItems): Promise<ToggleCompleteListItemResponse> => {
    const response = await apiCall(
      `${BASE_URL}/${groupId}/lists/${listId}/items/toggle-all`,
      "PATCH",
      {
        body: JSON.stringify({ completed }),
      },
    );

    return response.data;
  },
};
