import { Stack } from "expo-router";
import { GroupsProvider } from "@/lib/context/GroupsProvider";

export default function AppProtectedLayout() {
  return (
    <GroupsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modals/select-group"
          options={{
            presentation: "fullScreenModal",
            headerShown: false,
            title: "Select Group",
          }}
        />
      </Stack>
    </GroupsProvider>
  );
}
