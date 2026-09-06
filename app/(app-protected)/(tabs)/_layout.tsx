import { Icon } from "@/shared/components/icon";
import { TabBar } from "@/shared/components/tab-bar";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { useGroupsProvider } from "@/features/groups/providers/groups-provider";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";

const ICON_SIZE = 25;

export default function TabLayout() {
  const { user } = useAuthProvider();
  const { isLoading: selectedGroupLoading } = useGroupsProvider();
  const splashHidden = useRef(false);

  const isInitiallyReady = !!user && !selectedGroupLoading;

  useEffect(() => {
    if (isInitiallyReady && !splashHidden.current) {
      splashHidden.current = true;
      SplashScreen.hideAsync();
    }
  }, [isInitiallyReady]);

  if (!user || (selectedGroupLoading && !splashHidden.current)) {
    return null;
  }

  return (
    <Tabs
      detachInactiveScreens={false}
      screenOptions={{
        animation: "none",
        lazy: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={ICON_SIZE}
              name="home-alt-2"
              fill={color}
              pack={focused ? "filled" : "basic"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon size={ICON_SIZE} name="group-alt" fill={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon size={ICON_SIZE} name="bell" fill={color} pack={focused ? "filled" : "basic"} />
          ),
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: "You",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={ICON_SIZE}
              name="user-circle"
              fill={color}
              pack={focused ? "filled" : "basic"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
