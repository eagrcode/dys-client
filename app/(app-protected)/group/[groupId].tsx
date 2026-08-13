import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useDeleteGroup } from "@/_features/groups/hooks/use-delete-group";
import { useGroupById } from "@/_features/groups/hooks/use-group-id";
import { getGroupInitials } from "@/_features/groups/utils/get-group-initials";
import { BackButton } from "@/_shared/components/back-button";
import { ActionRow } from "@/_shared/components/action-row";
import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";

export default function GroupSettingsScreen() {
  const theme = useCurrentTheme();
  const { user } = useAuthProvider();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { data: group, isPending, isError, isFetching, refetch } = useGroupById(groupId);
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();

  const confirmDelete = () => {
    if (!groupId || !group) return;

    Alert.alert(
      `Delete ${group.name}?`,
      "This permanently deletes the group and its associated data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteGroup(
              { groupId },
              {
                onError: (error) => {
                  Alert.alert("Could not delete group", error.message || "Please try again.");
                },
              },
            ),
        },
      ],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <BackButton type="left" />
        <ThemedText variant="title" style={styles.title}>
          Group settings
        </ThemedText>
      </View>

      {isPending ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      ) : isError || !group ? (
        <View style={styles.stateContainer}>
          <ThemedText variant="defaultSemiBold">This group could not be loaded.</ThemedText>
          <Pressable
            accessibilityRole="button"
            disabled={isFetching || !groupId}
            onPress={() => refetch()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : isFetching ? 0.5 : 1 })}
          >
            <ThemedText variant="defaultSemiBold" style={{ color: theme.colors.accent }}>
              {isFetching ? "Retrying…" : "Retry"}
            </ThemedText>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.groupCard,
              {
                backgroundColor: theme.colors.bgLayer1,
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
            <View style={styles.groupDetails}>
              <ThemedText variant="defaultSemiBold" style={styles.groupName}>
                {group.name}
              </ThemedText>
              <ThemedText variant="soft" style={styles.role}>
                {group.created_by === user?.id ? "Created by you" : "Member"}
              </ThemedText>
              {group.description ? (
                <ThemedText variant="soft" style={styles.description}>
                  {group.description}
                </ThemedText>
              ) : null}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText variant="defaultSemiBold" style={styles.sectionTitle}>
              Group
            </ThemedText>
            <ActionRow
              icon="edit"
              label="Edit group details"
              disabledReason="Coming soon"
            />
            <ActionRow
              icon="person"
              label="Members and invitations"
              disabledReason="Coming soon"
            />
          </View>

          <View style={styles.section}>
            <ThemedText variant="defaultSemiBold" style={styles.sectionTitle}>
              Your settings
            </ThemedText>
            <ActionRow
              icon="notifications"
              label="Notification preferences"
              disabledReason="Coming soon"
            />
          </View>

          <View style={styles.section}>
            <ThemedText variant="defaultSemiBold" style={styles.sectionTitle}>
              Membership
            </ThemedText>
            {group.created_by === user?.id ? (
              <ActionRow
                icon="trash"
                label="Delete group"
                tone="danger"
                loading={isDeleting}
                onPress={confirmDelete}
              />
            ) : (
              <ActionRow icon="close" label="Leave group" disabledReason="Coming soon" />
            )}
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
    letterSpacing: 1,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    gap: 24,
    paddingBottom: 40,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  groupAvatar: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
  },
  groupDetails: {
    flex: 1,
    gap: 3,
  },
  groupName: {
    fontSize: 18,
  },
  role: {
    fontSize: 12,
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 19,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    marginLeft: 4,
    fontSize: 14,
  },
});
