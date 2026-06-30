export type Group = {
  id: string;
  name: string;
  created_by: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type DeleteGroupResponse = {
  id: string;
  name: string;
};
