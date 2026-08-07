import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";

export function useStoredGroupId() {
  const { storedGroupId } = useGroupsProvider();

  if (!storedGroupId) throw new Error("No group selected");
  return storedGroupId;
}
