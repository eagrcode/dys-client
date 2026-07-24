import { Stack } from "expo-router";
import { SocketProvider } from "@/_shared/realtime/socket-provider";

export default function AppProtectedLayout() {
  return (
    <SocketProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SocketProvider>
  );
}
