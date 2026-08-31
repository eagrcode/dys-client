import type { Member } from "./t-members";

export namespace GetMembers {
  export type Request = {
    groupId: string;
  };
  export type Response = Member[];
}
