import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupById } from "@/_features/groups/hooks/use-group-id";
import { getGroupInitials } from "@/_features/groups/utils/get-group-initials";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { ThemedText } from "@/_shared/components/themed-text";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";

export default function GroupActionsModal() {
  const theme = useCurrentTheme();
  const { user } = useAuthProvider();
  const { data: group, isPending, isError, isFetching, refetch } = useGroupById();

  const openGroupSettings = () => {
    if (!group?.id) return;

    router.replace({
      pathname: "/(app-protected)/group/[groupId]",
      params: { groupId: group.id },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bgLayer1 }]}>
      {isPending ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      ) : isError || !group ? (
        <View style={styles.stateContainer}>
          <ThemedText variant="defaultSemiBold">This group could not be loaded.</ThemedText>
          <Pressable
            accessibilityRole="button"
            disabled={isFetching || !group?.id}
            onPress={() => refetch()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : isFetching ? 0.5 : 1 })}
          >
            <ThemedText variant="defaultSemiBold" style={{ color: theme.colors.accent }}>
              {isFetching ? "Retrying…" : "Retry"}
            </ThemedText>
          </Pressable>
        </View>
      ) : (
        <>
          <View
            style={[
              styles.groupSummary,
              {
                backgroundColor: theme.colors.bgLayer2,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.xl,
              },
            ]}
          >
            <View style={[styles.groupAvatar, { backgroundColor: theme.colors.accentSoft }]}>
              <ThemedText style={[styles.initials, { color: theme.colors.accent }]}>
                {getGroupInitials(group.name)}
              </ThemedText>
            </View>
            <View style={styles.summaryContent}>
              <ThemedText variant="defaultSemiBold" style={styles.groupName} numberOfLines={1}>
                {group.name}
              </ThemedText>
              <ThemedText variant="soft" style={styles.role}>
                {group.created_by === user?.id ? "Created by you" : "Member"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.actions}>
            <ActionRow icon="person" label="Members" hint="Coming soon" disabled />
            <ActionRow icon="plus" label="Invite someone" hint="Coming soon" disabled />
            <ActionRow
              icon="notifications"
              label="Notification settings"
              hint="Coming soon"
              disabled
            />
            <ActionRow icon="settings" label="Manage group" onPress={openGroupSettings} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const ActionRow = ({
  icon,
  label,
  hint,
  disabled = false,
  onPress,
}: {
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  label: string;
  hint?: string;
  disabled?: boolean;
  onPress?: () => void;
}) => {
  const theme = useCurrentTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionRow,
        {
          backgroundColor: theme.colors.bgLayer1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.65 : disabled ? 0.5 : 1,
        },
      ]}
    >
      <IconSymbol
        name={icon}
        size={21}
        color={disabled ? theme.colors.textMuted : theme.colors.accent}
      />
      <ThemedText variant="defaultSemiBold" style={styles.actionLabel}>
        {label}
      </ThemedText>
      {hint ? (
        <ThemedText variant="soft" style={styles.actionHint}>
          {hint}
        </ThemedText>
      ) : (
        <IconSymbol name="chevron-right" size={18} color={theme.colors.icon} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    letterSpacing: 1,
  },
  stateContainer: {
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  groupSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
  },
  summaryContent: {
    flex: 1,
    gap: 2,
  },
  groupName: {
    fontSize: 17,
  },
  role: {
    fontSize: 12,
  },
  actions: {
    gap: 10,
  },
  actionRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  actionLabel: {
    flex: 1,
  },
  actionHint: {
    fontSize: 12,
  },
});
