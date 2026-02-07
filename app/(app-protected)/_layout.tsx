// app/(app-protected)/_layout.tsx
import { Stack } from "expo-router";

export default function AppProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Main tabs */}
      <Stack.Screen name="(tabs)" />

      {/* Modals */}
      <Stack.Screen
        name="modals/select-group"
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
          title: "Select Group",
        }}
      />
    </Stack>
  );
}
