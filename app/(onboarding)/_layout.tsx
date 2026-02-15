import { Stack } from "expo-router";
import { GroupsProvider } from "@/lib/context/GroupsProvider";

export default function OnboardingLayout() {
  return (
    <GroupsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="create-group" />
      </Stack>
    </GroupsProvider>
  );
}
