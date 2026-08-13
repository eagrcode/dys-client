import type { ListType } from "@/_features/lists/constants/list-types-config";
import type { List } from "@/_features/lists/types/t-list";

export namespace GetLists {
  export type Request = {
    groupId: string;
  };
  export type Response = List[];
}

export namespace GetListById {
  export type Request = {
    groupId: string;
    listId: string;
  };
  export type Response = List;
}

export namespace CreateList {
  export type Request = {
    groupId: string;
    data: {
      title: string;
      listType: ListType;
    };
  };
  export type Response = List;
}

export namespace CreateListItem {
  export type Request = {
    groupId: string;
    listId: string;
    content: string;
  };
  export type Response = {
    list_id: string;
    id: string;
    content: string;
    completed: boolean;
    created_at: string;
  };
}

export namespace RenameList {
  export type Request = {
    groupId: string;
    listId: string;
    newTitle: string;
  };
  export type Response = {
    title: string;
  };
}

export namespace UpdateListItem {
  export type Request = {
    groupId: string;
    listId: string;
    itemId: string;
    content: string;
  };
  export type Response = {
    list_id: string;
    id: string;
    content: string;
  };
}

export namespace DeleteList {
  export type Request = {
    groupId: string;
    listId: string;
  };
  export type Response = List;
}

export namespace DeleteListItems {
  export type Request = {
    groupId: string;
    listId: string;
    itemIds: string[];
  };
  export type Response = {
    list_id: string;
    deletedItemIds: string[];
    deletedCount: number;
  };
}

export namespace ToggleCompleteListItem {
  export type Request = {
    groupId: string;
    listId: string;
    itemId: string;
    completed: boolean;
  };
  export type Response = {
    list_id: string;
    id: string;
    completed: boolean;
    updated_at: string;
  };
}

export namespace ToggleCompleteAllListItems {
  export type Request = {
    groupId: string;
    listId: string;
    completed: boolean;
  };
  export type Response = {
    list_id: string;
    completed: boolean;
    updatedItemCount: number;
  };
}
