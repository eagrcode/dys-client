import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroups } from "@/_features/groups/hooks/use-groups";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";
import { getGroupInitials } from "@/_features/groups/utils/get-group-initials";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import type { Group } from "@/_features/groups/types/t-group";
import RetryFetch from "@/_shared/components/retry-fetch";
import type { User } from "@/_features/auth/auth-types";

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
      pathname: "/(app-protected)/(modals)/group-actions",
      params: { groupId },
    });
  };

  const loadingContent = (
    <View style={styles.centered}>
      <ActivityIndicator
        style={{ transform: [{ scale: 1.2 }] }}
        size="small"
        color={theme.colors.accent}
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
        <ThemedText variant="title" style={headerStyles.title}>
          Groups
        </ThemedText>
        <ThemedText variant="soft" style={headerStyles.subtitle}>
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
        <IconSymbol name="plus-circle-filled" size={30} color={theme.colors.accent} />
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
            isCurrent && !isSwitching ? theme.colors.bgLayer2 : theme.colors.bgLayer1,
          borderColor: theme.colors.border,
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
            { backgroundColor: theme.colors.accentSoft, borderRadius: theme.radius.full },
          ]}
        >
          <ThemedText style={[groupCardStyles.initials, { color: theme.colors.accent }]}>
            {getGroupInitials(group.name)}
          </ThemedText>
        </View>

        <View style={groupCardStyles.cardContent}>
          <ThemedText variant="defaultSemiBold" numberOfLines={1}>
            {group.name}
          </ThemedText>
          <ThemedText variant="soft" style={groupCardStyles.role}>
            {isCreator ? "Created by you" : "Member"}
          </ThemedText>
          {group.description ? (
            <ThemedText variant="soft" style={groupCardStyles.description} numberOfLines={1}>
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
        <IconSymbol name="ellipsis" size={20} color={theme.colors.icon} />
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
    gap: 16,
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
    gap: 12,
    paddingBottom: 32,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});

const groupCardStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cardMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  groupAvatar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: "DMSans_700Bold",
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
