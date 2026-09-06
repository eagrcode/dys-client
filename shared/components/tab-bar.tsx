import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "@/shared/theme/theme";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useCurrentTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingBottom: insets.bottom ? insets.bottom : spacing[16],
          backgroundColor: theme.colors.tabBar.primary,
          borderTopColor: theme.colors.border.primary,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.tabs}>
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
                color: focused ? theme.colors.accent.primary : theme.colors.text.muted,
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
  tabs: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    gap: spacing[8],
  },
  tabButton: {
    padding: spacing[16],
  },
});
