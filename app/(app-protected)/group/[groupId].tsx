import { Alert, SectionList, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { useDeleteGroup } from "@/features/groups/mutations/use-delete-group";
import { useGroupById } from "@/features/groups/queries/use-group-id";
import { getGroupInitials } from "@/features/groups/utils/get-group-initials";
import { BackButton } from "@/shared/components/back-button";
import { ActionRow } from "@/shared/components/action-row";
import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { radius, spacing } from "@/shared/theme/theme";
import type { Group } from "@/features/groups/types/t-group";
import type { User } from "@/features/auth/types/auth-types";
import { Icon } from "@/shared/components/icon";

type Row = {
  icon: React.ComponentProps<typeof Icon>["name"] | null;
  rowTitle: string;
  onPress: () => void;
  isDestructive?: boolean;
  groupCreator?: boolean;
};

type Section = {
  title: string;
  data: Row[];
};

export default function GroupSettingsScreen() {
  const { user } = useAuthProvider();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { data: group } = useGroupById(groupId);
  const { mutate: deleteGroup } = useDeleteGroup();

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

  if (!group) {
    return null;
  }

  const sections: Section[] = [
    {
      title: "Group",
      data: [
        {
          icon: "pencil-simple",
          rowTitle: "Edit group details",
          onPress: () => void 0,
        },
      ],
    },
    {
      title: "Your settings",
      data: [
        {
          icon: "bell",
          rowTitle: "Notification preferences",
          onPress: () => void 0,
        },
      ],
    },
    {
      title: "Membership",
      data: [
        {
          icon: "trash",
          rowTitle: group.created_by === user?.id ? "Delete group" : "Leave group",
          isDestructive: true,
          onPress: confirmDelete,
          groupCreator: group.created_by === user?.id,
        },
      ],
    },
  ];

  return (
    <ThemedView isSecondary header={<Header />}>
      <GroupSummary group={group} user={user} />
      <SectionList
        sections={sections}
        keyExtractor={(row) => row.rowTitle}
        renderSectionHeader={({ section: { title } }) => (
          <ThemedText variant="subHeader">{title}</ThemedText>
        )}
        renderItem={({ item }) => (
          <ActionRow
            icon={item.icon}
            label={item.rowTitle}
            onPress={item.onPress}
            disabledReason={!item.groupCreator ? "Coming soon" : undefined}
            tone={item.isDestructive ? "danger" : "default"}
          />
        )}
      />
    </ThemedView>
  );
}

function Header() {
  return (
    <View style={headerStyles.container}>
      <BackButton type="left" />
      <ThemedText variant="header">Group settings</ThemedText>
    </View>
  );
}

type GroupSummaryProps = {
  group: Group;
  user: User | null;
};

function GroupSummary({ group, user }: GroupSummaryProps) {
  const { colors } = useCurrentTheme();
  return (
    <View
      style={[
        groupSummaryStyles.groupCard,
        {
          backgroundColor: colors.bgLayer1,
          borderColor: colors.border,
          borderRadius: radius.lg,
        },
      ]}
    >
      <View
        style={[
          groupSummaryStyles.groupAvatar,
          { backgroundColor: colors.accentSoft, borderRadius: radius.lg },
        ]}
      >
        <ThemedText
          variant="header"
          style={[groupSummaryStyles.initials, { color: colors.accent }]}
        >
          {getGroupInitials(group.name)}
        </ThemedText>
      </View>
      <View>
        <ThemedText variant="subHeader">{group.name}</ThemedText>
        {group.description ? <ThemedText variant="tag">{group.description}</ThemedText> : null}
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[8],
  },
});

const groupSummaryStyles = StyleSheet.create({
  groupCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[8],
    padding: spacing[16],
    borderWidth: 1,
  },
  groupAvatar: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 20,
  },
});

{
  /* <ThemedText variant="tag" style={[groupSummaryStyles.role, { color: colors.textMuted }]}>
  {group.created_by === user?.id ? "Created by you" : "Member"}
</ThemedText>; */
}
