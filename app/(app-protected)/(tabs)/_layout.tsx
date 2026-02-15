import { Link, Tabs } from "expo-router";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useGroupById } from "@/hooks/queries/useGroupById";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { selectedGroup, isLoading: groupsProviderLoading } = useGroupsProvider();
  const { data: groupDetails, isLoading: groupDetailsLoading } = useGroupById(selectedGroup || "");

  const isReady = !groupsProviderLoading && !groupDetailsLoading;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
        headerTitle: () => (
          <View>
            <Link href="/(app-protected)/modals/select-group">
              <ThemedText type="defaultSemiBold">
                {groupDetails ? groupDetails.name : "No Group Selected"}
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
        name="create-group"
        options={{
          title: "Create Group",
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
