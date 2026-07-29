export type ListType = "todo" | "shopping" | "other";

export type ListItem = {
  id: string;
  list_id: string;
  content: string;
  completed: boolean;
  created_at: string;
  updated_at: string | null;
};

export type List = {
  id: string;
  created_by: string;
  group_id: string;
  list_type: ListType;
  title: string;
  assigned_to?: string | null;
  due_date?: string | null;
  completed: boolean;
  created_at: string;
  updated_at?: string | null;
  completed_at?: string | null;
  items?: ListItem[];
};

export type ToggleCompleteListItemResponse = {
  id: string;
  completed: boolean;
  updated_at: string;
};

export type DeleteListItemsResponse = {
  listId: string;
  deletedItemIds: string[];
  deletedCount: number;
};

export type ToggleCompleteAllListItemsResponse = {
  listId: string;
  completed: boolean;
  updatedItemCount: number;
};

export type UpdateListItemResponse = {
  id: string;
  content: string;
};

export type ListMode = "default" | "edit-item" | "select-items";
