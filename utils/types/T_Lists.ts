export type ListType = "todo" | "shopping" | "other";

export type ListItem = {
  id: string;
  list_id: string;
  content: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
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

export type ListWithItems = List & {
  items: ListItem[];
};
