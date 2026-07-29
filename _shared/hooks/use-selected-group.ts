import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";

export function useSelectedGroup() {
  const { selectedGroup } = useGroupsProvider();

  if (!selectedGroup) throw new Error("No group selected");
  return selectedGroup;
}
