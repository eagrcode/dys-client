export type CacheIdentifier = keyof typeof listKeys;

export const listKeys = {
  group: (groupId: string) => ["groups", groupId, "lists"] as const,

  detail: (groupId: string, listId: string) => ["groups", groupId, "lists", listId] as const,

  dashboard: (groupId: string) => ["groups", groupId, "dashboard-count"] as const,
};
