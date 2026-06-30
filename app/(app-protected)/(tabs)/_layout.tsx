import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TabBar } from "@/components/ui/tab-bar";
import { useGroupById } from "@/hooks/queries/useGroupById";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { Tabs, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { Pressable, View } from "react-native";

export default function TabLayout() {
  const theme = useCurrentTheme();
  const router = useRouter();
  const { user } = useAuthProvider();
  const { selectedGroup, isLoading: groupsLoading } = useGroupsProvider();
  const { data: groupDetails, isLoading: currentGroupLoading } = useGroupById();
  const splashHidden = useRef(false);

  const isReady = !!user && !groupsLoading && !!selectedGroup && !currentGroupLoading;

  useEffect(() => {
    if (isReady && !splashHidden.current) {
      splashHidden.current = true;
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <Tabs
      safeAreaInsets={{ bottom: 0 }}
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.header,
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
