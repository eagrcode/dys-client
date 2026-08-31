import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import {
  Pressable,
  StyleSheet,
  View,
  type AccessibilityRole,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type RowBackground = "bgLayer1" | "bgLayer2" | "bgLayer3";

export type RowSurfaceProps = {
  background?: RowBackground;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type PressableRowSurfaceProps = {
  accessibilityRole?: AccessibilityRole;
  background?: RowBackground;
  children: React.ReactNode;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export function RowSurface({ background = "bgLayer1", children, style }: RowSurfaceProps) {
  const theme = useCurrentTheme();

  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: theme.colors[background],
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function PressableRowSurface({
  accessibilityRole,
  background = "bgLayer1",
  children,
  disabled = false,
  onPress,
  style,
}: PressableRowSurfaceProps) {
  const theme = useCurrentTheme();
  const isDisabled = Boolean(disabled);

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.surface,
        {
          backgroundColor: theme.colors[background],
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.7 : isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
