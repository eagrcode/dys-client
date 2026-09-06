import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { Icon, type IconName } from "./icon";
import { spacing } from "@/shared/theme/theme";

type Props = {
  disabled?: boolean;
  disabledReason?: string;
  icon?: IconName | null;
  label: string;
  loading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
  tone?: "default" | "danger";
};

export function ActionRow({
  disabled = false,
  disabledReason,
  icon = null,
  label,
  loading = false,
  onPress,
  showChevron = false,
  style,
  tone = "default",
}: Props) {
  const theme = useCurrentTheme();
  const isDisabled = disabled || loading || Boolean(disabledReason);
  const foreground = tone === "danger" ? theme.colors.accent.danger : theme.colors.text.primary;
  let iconColor = theme.colors.icon.primary;

  if (tone === "danger") {
    iconColor = theme.colors.accent.danger;
  }

  if (disabledReason) {
    iconColor = theme.colors.text.muted;
  }

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          opacity: pressed ? 0.7 : isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={20} fill={iconColor} /> : null}

      <View style={styles.content}>
        <ThemedText style={{ color: foreground }}>{label}</ThemedText>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={foreground} />
      ) : disabledReason ? (
        <ThemedText variant="tag" style={styles.supportingText}>
          {disabledReason}
        </ThemedText>
      ) : showChevron ? (
        <Icon name="chevron-right" size={18} fill={theme.colors.icon.primary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[12],
    paddingVertical: spacing[12],
  },
  content: {
    flex: 1,
    gap: 2,
  },
  supportingText: {
    fontSize: 12,
  },
});
