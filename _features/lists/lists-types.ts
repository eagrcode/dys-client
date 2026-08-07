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
  list_id: string;
  id: string;
  completed: boolean;
  updated_at: string;
};

export type DeleteListItemsResponse = {
  list_id: string;
  deletedItemIds: string[];
  deletedCount: number;
};

export type ToggleCompleteAllListItemsResponse = {
  list_id: string;
  completed: boolean;
  updatedItemCount: number;
};

export type UpdateListItemResponse = {
  list_id: string;
  id: string;
  content: string;
};

export type ListMode = "default" | "select-items";
