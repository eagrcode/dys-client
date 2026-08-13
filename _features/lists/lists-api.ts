import { apiCall } from "@/_shared/utils/api-call";
import type {
  GetLists,
  CreateList,
  GetListById,
  DeleteList,
  CreateListItem,
  UpdateListItem,
  DeleteListItems,
  RenameList,
  ToggleCompleteListItem,
  ToggleCompleteAllListItems,
} from "./types/t-lists-api";
import { log } from "@/_shared/logger/logger";

const BASE_URL = `/groups`;

export const listsAPI = {
  getGroupLists: async (req: GetLists.Request): Promise<GetLists.Response> => {
    const { groupId } = req;
    const response = await apiCall<GetLists.Response>(`${BASE_URL}/${groupId}/lists`, "GET");
    return response;
  },

  createList: async (req: CreateList.Request): Promise<CreateList.Response> => {
    const { groupId, data } = req;
    const response = await apiCall<CreateList.Response>(`${BASE_URL}/${groupId}/lists`, "POST", {
      body: JSON.stringify(data),
    });
    return response;
  },

  getListById: async (req: GetListById.Request): Promise<GetListById.Response> => {
    const { groupId, listId } = req;
    const response = await apiCall<GetListById.Response>(
      `${BASE_URL}/${groupId}/lists/${listId}`,
      "GET",
    );
    log.info("listsAPI.getListById | Response", { response });
    return response;
  },

  deleteList: async (req: DeleteList.Request): Promise<DeleteList.Response> => {
    const { groupId, listId } = req;
    const response = await apiCall<DeleteList.Response>(
      `${BASE_URL}/${groupId}/lists/${listId}`,
      "DELETE",
    );
    return response;
  },

  createListItem: async (req: CreateListItem.Request): Promise<CreateListItem.Response> => {
    const { groupId, listId, content } = req;
    const response = await apiCall<CreateListItem.Response>(
      `${BASE_URL}/${groupId}/lists/${listId}/items`,
      "POST",
      {
        body: JSON.stringify({ content }),
      },
    );
    return response;
  },

  updateListItem: async (req: UpdateListItem.Request): Promise<UpdateListItem.Response> => {
    const { groupId, listId, itemId, content } = req;
    const response = await apiCall<UpdateListItem.Response>(
      `${BASE_URL}/${groupId}/lists/${listId}/items/${itemId}`,
      "PATCH",
      {
        body: JSON.stringify({ content }),
      },
    );

    return response;
  },

  renameList: async (req: RenameList.Request): Promise<RenameList.Response> => {
    const { groupId, listId, newTitle } = req;
    const response = await apiCall<RenameList.Response>(
      `${BASE_URL}/${groupId}/lists/${listId}`,
      "PATCH",
      {
        body: JSON.stringify({ newTitle }),
      },
    );

    return response;
  },

  deleteListItems: async (req: DeleteListItems.Request): Promise<DeleteListItems.Response> => {
    const { groupId, listId, itemIds } = req;
    const response = await apiCall<DeleteListItems.Response>(
      `${BASE_URL}/${groupId}/lists/${listId}/items/delete`,
      "DELETE",
      {
        body: JSON.stringify({ itemIds }),
      },
    );

    return response;
  },

  toggleCompleteListItem: async (
    req: ToggleCompleteListItem.Request,
  ): Promise<ToggleCompleteListItem.Response> => {
    const { groupId, listId, itemId, completed } = req;
    const response = await apiCall<ToggleCompleteListItem.Response>(
      `${BASE_URL}/${groupId}/lists/${listId}/items/${itemId}/toggle`,
      "PATCH",
      {
        body: JSON.stringify({ completed }),
      },
    );

    return response;
  },

  toggleCompleteAllListItems: async (
    req: ToggleCompleteAllListItems.Request,
  ): Promise<ToggleCompleteAllListItems.Response> => {
    const { groupId, listId, completed } = req;
    const response = await apiCall<ToggleCompleteAllListItems.Response>(
      `${BASE_URL}/${groupId}/lists/${listId}/items/toggle-all`,
      "PATCH",
      {
        body: JSON.stringify({ completed }),
      },
    );

    return response;
  },
};
