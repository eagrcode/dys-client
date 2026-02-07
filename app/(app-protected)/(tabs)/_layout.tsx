import { Link, router, Stack, Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { selectedGroup } = useGroupsProvider();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
        headerTitle: () => (
          <View>
            <Link href="/(app-protected)/modals/select-group">
              <ThemedText type="defaultSemiBold">
                {selectedGroup ? selectedGroup.name : "No Group Selected"}
              </ThemedText>
            </Link>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      {/* <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
        }}
      /> */}
    </Tabs>
  );
}
