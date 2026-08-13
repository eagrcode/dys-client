import type { Group } from "@/_features/groups/types/t-group";

export namespace GetGroups {
  export type Response = Group[];
}

export namespace CreateGroup {
  export type Request = {
    data: {
      name: string;
      description: string;
    };
  };
  export type Response = Group;
}

export namespace GetGroupById {
  export type Request = {
    groupId: string;
  };
  export type Response = Group;
}

export namespace DeleteGroup {
  export type Request = {
    groupId: string;
  };
  export type Response = {
    id: string;
    name: string;
  };
}
