import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { useGroups } from "@/features/groups/queries/use-groups";
import { useGroupsProvider } from "@/features/groups/providers/groups-provider";
import { getGroupInitials } from "@/features/groups/utils/get-group-initials";
import { Icon } from "@/shared/components/icon";
import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import type { Group } from "@/features/groups/types/t-group";
import { RetryFetch } from "@/shared/components/retry-fetch";
import type { User } from "@/features/auth/types/auth-types";
import { spacing } from "@/shared/theme/theme";

function GroupsScreen() {
  const theme = useCurrentTheme();
  const { user } = useAuthProvider();
  const { selectedGroup, selectGroup } = useGroupsProvider();
  const {
    data: groups = [],
    isLoading,
    isPending,
    isError,
    isFetching,
    refetch,
    error,
  } = useGroups();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSelectGroup = async (groupId: string) => {
    if (groupId === selectedGroup?.id) {
      router.navigate("/(app-protected)/(tabs)/home");
      return;
    }

    setIsSwitching(true);

    try {
      router.navigate("/(app-protected)/(tabs)/home");

      await selectGroup(groupId);
    } catch {
      Alert.alert("Could not switch groups", "Please try again.");
    } finally {
      setIsSwitching(false);
    }
  };

  const showGroupActions = (groupId: string) => {
    router.push({
      pathname: "/(app-protected)/group/[groupId]",
      params: { groupId },
    });
  };

  const loadingContent = (
    <View style={styles.centered}>
      <ActivityIndicator
        style={{ transform: [{ scale: 1.2 }] }}
        size="small"
        color={theme.colors.accent.primary}
      />
    </View>
  );

  const errorContent = (
    <RetryFetch error={error} refetch={refetch} isFetching={isFetching} type="groups" />
  );

  const groupsContent = (
    <GroupsList
      groups={groups}
      selectedGroup={selectedGroup}
      user={user}
      isSwitching={isSwitching}
      handleSelectGroup={handleSelectGroup}
      showGroupActions={showGroupActions}
    />
  );

  let content = groupsContent;

  if (isLoading || isPending) {
    content = loadingContent;
  } else if (isError) {
    content = errorContent;
  }

  return (
    <ThemedView style={[styles.container]}>
      <Header />
      {content}
    </ThemedView>
  );
}

const Header = () => {
  const theme = useCurrentTheme();

  return (
    <View style={headerStyles.header}>
      <View>
        <ThemedText variant="header" style={headerStyles.title}>
          Groups
        </ThemedText>
        <ThemedText
          variant="body"
          style={[headerStyles.subtitle, { color: theme.colors.text.muted }]}
        >
          Choose where you want to spend time.
        </ThemedText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create a new group"
        hitSlop={10}
        onPress={() => router.push("/(app-protected)/create-group")}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Icon name="plus" size={30} fill={theme.colors.accent.primary} />
      </Pressable>
    </View>
  );
};

const GroupsList = ({
  groups,
  selectedGroup,
  user,
  isSwitching,
  handleSelectGroup,
  showGroupActions,
}: {
  groups: Group[];
  selectedGroup: Group | null;
  user: User | null;
  isSwitching: boolean;
  handleSelectGroup: (groupId: string) => Promise<void>;
  showGroupActions: (groupId: string) => void;
}) => {
  return (
    <ScrollView
      style={listStyles.list}
      contentContainerStyle={listStyles.listContent}
      showsVerticalScrollIndicator={false}
    >
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          isCurrent={group.id === selectedGroup?.id}
          isCreator={group.created_by === user?.id}
          isSwitching={isSwitching}
          onSelect={() => handleSelectGroup(group.id)}
          onOpenActions={() => showGroupActions(group.id)}
        />
      ))}
    </ScrollView>
  );
};

const GroupCard = ({
  group,
  isCurrent,
  isCreator,
  isSwitching,
  onSelect,
  onOpenActions,
}: {
  group: Group;
  isCurrent: boolean;
  isCreator: boolean;
  isSwitching: boolean;
  onSelect: () => void;
  onOpenActions: () => void;
}) => {
  const theme = useCurrentTheme();

  return (
    <View
      style={[
        groupCardStyles.card,
        {
          backgroundColor:
            isCurrent && !isSwitching ? theme.colors.background.layer2 : theme.colors.background.layer1,
          borderColor: theme.colors.border.primary,
          borderRadius: theme.radius.xl,
        },
      ]}
    >
      <Pressable
        disabled={isSwitching}
        onPress={onSelect}
        style={({ pressed }) => [
          groupCardStyles.cardMain,
          { opacity: pressed ? 0.65 : isSwitching ? 0.55 : 1 },
        ]}
      >
        <View
          style={[
            groupCardStyles.groupAvatar,
            { backgroundColor: theme.colors.accent.soft, borderRadius: theme.radius.full },
          ]}
        >
          <ThemedText style={[groupCardStyles.initials, { color: theme.colors.accent.primary }]}>
            {getGroupInitials(group.name)}
          </ThemedText>
        </View>

        <View style={groupCardStyles.cardContent}>
          <ThemedText variant="subHeader" numberOfLines={1}>
            {group.name}
          </ThemedText>
          <ThemedText
            variant="tag"
            style={[groupCardStyles.role, { color: theme.colors.text.muted }]}
          >
            {isCreator ? "Created by you" : "Member"}
          </ThemedText>
          {group.description ? (
            <ThemedText
              variant="tag"
              style={[groupCardStyles.description, { color: theme.colors.text.muted }]}
              numberOfLines={1}
            >
              {group.description}
            </ThemedText>
          ) : null}
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open actions for ${group.name}`}
        disabled={isSwitching}
        hitSlop={10}
        onPress={onOpenActions}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : isSwitching ? 0.4 : 1 }]}
      >
        <Icon
          name="dots-horizontal-rounded"
          size={20}
          fill={theme.colors.icon.primary}
          weight="normal"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    gap: spacing[16],
  },
});

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
  },
});

const listStyles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing[12],
    paddingBottom: spacing[32],
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[12],
  },
});

const groupCardStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
  },
  cardMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[12],
  },
  groupAvatar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: "HankenGrotesk_600SemiBold",
    fontSize: 17,
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  role: {
    fontSize: 12,
  },
  description: {
    fontSize: 12,
  },
});

export default GroupsScreen;
