import { Stack } from "expo-router";
import { SocketProvider } from "@/shared/realtime/socket-provider";

export default function AppProtectedLayout() {
  return (
    <SocketProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SocketProvider>
  );
}
