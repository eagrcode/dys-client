import {
  ActivityIndicator,
  StyleSheet,
  View,
  type AccessibilityRole,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { PressableRowSurface, type RowBackground } from "@/_shared/components/row-surface";
import { ThemedText } from "@/_shared/components/themed-text";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";

type Props = {
  accessibilityRole?: AccessibilityRole;
  background?: RowBackground;
  completed?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  icon?: React.ComponentProps<typeof IconSymbol>["name"] | null;
  iconSize?: number;
  label: string;
  loading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
  subtitle?: string;
  tone?: "default" | "danger";
  trailing?: React.ReactNode;
};

export function ActionRow({
  accessibilityRole,
  background,
  completed,
  disabled = false,
  disabledReason,
  icon = null,
  iconSize = 20,
  label,
  loading = false,
  onPress,
  showChevron = false,
  style,
  subtitle,
  tone = "default",
  trailing,
}: Props) {
  const theme = useCurrentTheme();
  const isDisabled = disabled || loading || Boolean(disabledReason);
  const foreground = tone === "danger" ? theme.colors.danger : theme.colors.text;
  let iconColor = completed === false ? theme.colors.icon : theme.colors.accent;

  if (tone === "danger") {
    iconColor = theme.colors.danger;
  }

  if (disabledReason) {
    iconColor = theme.colors.textMuted;
  }

  return (
    <PressableRowSurface
      accessibilityRole={accessibilityRole}
      background={background}
      disabled={isDisabled}
      onPress={onPress}
      style={style}
    >
      {icon ? <IconSymbol name={icon} size={iconSize} color={iconColor} /> : null}

      <View style={styles.content}>
        <ThemedText
          variant="defaultSemiBold"
          style={[{ color: foreground }, completed && styles.completedText]}
        >
          {label}
        </ThemedText>
        {subtitle ? (
          <ThemedText variant="soft" style={styles.supportingText}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={foreground} />
      ) : disabledReason ? (
        <ThemedText variant="soft" style={styles.supportingText}>
          {disabledReason}
        </ThemedText>
      ) : trailing ? (
        trailing
      ) : showChevron ? (
        <IconSymbol name="chevron-right" size={18} color={theme.colors.icon} />
      ) : null}
    </PressableRowSurface>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 2,
  },
  supportingText: {
    fontSize: 12,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.4,
  },
});
