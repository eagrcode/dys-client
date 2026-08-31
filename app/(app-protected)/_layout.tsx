import { Stack } from "expo-router";
import { SocketProvider } from "@/shared/realtime/socket-provider";

export default function AppProtectedLayout() {
  return (
    <SocketProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(modals)/group-actions"
          options={{
            animation: "none",
            presentation: "transparentModal",
            gestureEnabled: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="(modals)/list-detail-actions"
          options={{
            animation: "none",
            presentation: "transparentModal",
            gestureEnabled: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack>
    </SocketProvider>
  );
}
