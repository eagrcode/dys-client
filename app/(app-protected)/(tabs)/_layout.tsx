import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TabBar } from "@/components/ui/tab-bar";
import { useTheme } from "@/hooks/use-theme";
import { ActivityIndicator, Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useGroupById } from "@/hooks/queries/useGroupById";
import { useGroupLists } from "@/hooks/queries/useGroupLists";

export default function TabLayout() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthProvider();
  const { selectedGroup, isLoading: groupsProviderLoading } = useGroupsProvider();
  const { data: groupDetails, isLoading: groupDetailsLoading } = useGroupById(selectedGroup || "");
  const { isLoading: groupListsLoading } = useGroupLists(selectedGroup || "");

  const splashHidden = useRef(false);

  const isReady = !!user && !groupsProviderLoading && !groupDetailsLoading && !groupListsLoading;

  useEffect(() => {
    if (isReady && !splashHidden.current) {
      splashHidden.current = true;
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </ThemedView>
    );
  }

  return (
    <Tabs
      safeAreaInsets={{ bottom: 0 }}
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 1,
          borderColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.header,
          borderBottomWidth: 1,
          borderColor: theme.colors.border,
          height: 120,
        },
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable
            onPress={() => router.push("/(app-protected)/modals/select-group")}
            style={({ pressed }) => ({ marginLeft: 16, opacity: pressed ? 0.6 : 1 })}
          >
            <ThemedText style={{ fontSize: 18, letterSpacing: 2 }} variant="title">
              {groupDetails ? groupDetails.name : "No Group Selected"}
            </ThemedText>
            <ThemedText
              style={{ fontSize: 14, opacity: 0.6, width: 200 }}
              variant="subtitle"
              numberOfLines={2}
            >
              {groupDetails ? groupDetails.description : "No Group Selected"}
            </ThemedText>
          </Pressable>
        ),
        headerRight: () => (
          <View style={{ marginRight: 16 }}>
            <IconSymbol name="gearshape.fill" size={24} color={theme.colors.icon} />
          </View>
        ),
        headerTitle: "",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="bell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: "You",
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
