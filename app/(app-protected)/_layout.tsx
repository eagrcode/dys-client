import { Stack } from "expo-router";
import { GroupsProvider } from "@/_features/groups/providers/groups-provider";
import { SocketProvider } from "@/_shared/realtime/socket-provider";

export default function AppProtectedLayout() {
  return (
    <GroupsProvider>
      <SocketProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SocketProvider>
    </GroupsProvider>
  );
}
