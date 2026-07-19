import { Stack } from "expo-router";
import { GroupsProvider } from "@/_features/groups/providers/groups-provider";

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
