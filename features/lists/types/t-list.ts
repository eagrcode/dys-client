import type { ListType } from "@/features/lists/constants/list-types-config";

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
