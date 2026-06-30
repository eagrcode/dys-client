import { Stack } from "expo-router";
import { GroupsProvider } from "@/lib/context/GroupsProvider";

export default function AppProtectedLayout() {
  return (
    <GroupsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lists" options={{ headerShown: false }} />
        <Stack.Screen name="list/[listId]" options={{ headerShown: false }} />
        <Stack.Screen name="calendar" options={{ headerShown: true, title: "Calendar" }} />
        <Stack.Screen name="albums" options={{ headerShown: true, title: "Albums" }} />
        <Stack.Screen name="text-channels" options={{ headerShown: true, title: "Chat" }} />
        <Stack.Screen
          name="create-group"
          options={{
            presentation: "fullScreenModal",
            headerShown: false,
            title: "Create Group",
          }}
        />
        <Stack.Screen
          name="modals/select-group"
          options={{
            presentation: "fullScreenModal",
            headerShown: false,
            title: "Select Group",
          }}
        />
        <Stack.Screen
          name="modals/create-list"
          options={{
            presentation: "fullScreenModal",
            headerShown: false,
            title: "Create List",
          }}
        />
        <Stack.Screen
          name="modals/edit-list"
          options={{
            presentation: "modal",
            headerShown: false,
            title: "Edit List",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack>
    </GroupsProvider>
  );
}
