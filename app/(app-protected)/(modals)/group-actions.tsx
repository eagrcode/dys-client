import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getGroupInitials } from "@/_features/groups/utils/get-group-initials";
import { ActionRow } from "@/_shared/components/action-row";
import { SwipeableModalSheet } from "@/_shared/components/modals/swipeable-modal-sheet";
import { ThemedText } from "@/_shared/components/themed-text";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroupById } from "@/_features/groups/hooks/use-group-id";

const FALLBACK_HREF = "/(app-protected)/(tabs)/home";

export default function GroupActionsModal() {
  const theme = useCurrentTheme();
  const { user } = useAuthProvider();
  const { groupId } = useLocalSearchParams<{ groupId?: string | string[] }>();
  const resolvedGroupId = Array.isArray(groupId) ? groupId[0] : groupId;
  const { data: group, isPending, isError, isFetching, refetch } = useGroupById(resolvedGroupId);

  const openGroupSettings = () => {
    if (!group?.id) return;

    router.replace({
      pathname: "/(app-protected)/group/[groupId]",
      params: { groupId: group.id },
    });
  };

  const isShowingState = isPending || isError || !group;

  let content: React.ReactNode;

  if (isPending) {
    content = (
      <View style={styles.stateContainer}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  } else if (isError || !group) {
    content = (
      <View style={styles.stateContainer}>
        <ThemedText variant="defaultSemiBold">This group could not be loaded.</ThemedText>
        <Pressable
          accessibilityRole="button"
          disabled={isFetching}
          onPress={() => refetch()}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : isFetching ? 0.5 : 1 })}
        >
          <ThemedText variant="defaultSemiBold" style={{ color: theme.colors.accent }}>
            {isFetching ? "Retrying…" : "Retry"}
          </ThemedText>
        </Pressable>
      </View>
    );
  } else {
    content = (
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
          <View style={styles.summaryTopRow}>
            <View style={[styles.groupAvatar, { backgroundColor: theme.colors.accentSoft }]}>
              <ThemedText style={[styles.initials, { color: theme.colors.accent }]}>
                {getGroupInitials(group.name)}
              </ThemedText>
            </View>
            <View style={styles.summaryContent}>
              <ThemedText variant="defaultSemiBold" style={styles.groupName} numberOfLines={1}>
                {group.name}
              </ThemedText>

              <ThemedText variant="soft" numberOfLines={2}>
                {group.description}
              </ThemedText>
            </View>
          </View>
          <ThemedText variant="default" style={styles.role}>
            {group.created_by === user?.id ? "Created by you" : "Member"}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <ActionRow
            accessibilityRole="button"
            icon="person"
            label="Members"
            disabledReason="Coming soon"
          />
          <ActionRow
            accessibilityRole="button"
            icon="plus"
            label="Invite someone"
            disabledReason="Coming soon"
          />
          <ActionRow
            accessibilityRole="button"
            icon="notifications"
            label="Notification settings"
            disabledReason="Coming soon"
          />
          <ActionRow
            accessibilityRole="button"
            icon="settings"
            label="Manage group"
            showChevron
            onPress={openGroupSettings}
          />
        </View>
      </>
    );
  }

  return (
    <SwipeableModalSheet fallbackHref={FALLBACK_HREF}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, isShowingState && styles.stateContent]}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    </SwipeableModalSheet>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  stateContent: {
    justifyContent: "center",
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  groupSummary: {
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    fontSize: 18,
  },
  summaryContent: {
    flex: 1,
    gap: 2,
  },
  groupName: {
    fontSize: 16,
  },
  role: {
    fontSize: 12,
  },
  actions: {
    gap: 8,
  },
});
