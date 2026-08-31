// qk.groups.ts
export const groupKeys = {
  all: (userId: string) => ["groups", userId] as const,

  detail: (userId: string, groupId: string) => [...groupKeys.all(userId), groupId] as const,
};
