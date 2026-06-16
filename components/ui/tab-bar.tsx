import { useCurrentTheme } from "@/hooks/use-current-theme";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useCurrentTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom ? insets.bottom : 16,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.header,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={[styles.tabs, { borderColor: theme.colors.border }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;

          const onPress = () => {
            if (process.env.EXPO_OS === "ios") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tabButton}>
              {options.tabBarIcon?.({
                focused,
                color: focused ? theme.colors.accent : theme.colors.textMuted,
                size: 28,
              })}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },

  tabs: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    gap: 8,
  },
  tabButton: {
    padding: 16,
  },
});
