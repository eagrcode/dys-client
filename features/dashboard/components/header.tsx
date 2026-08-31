import { ThemedText } from "@/shared/components/themed-text";
import { router } from "expo-router";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { Pressable, View, StyleSheet } from "react-native";
import { useGroupsProvider } from "@/features/groups/providers/groups-provider";
import { getGroupInitials } from "@/features/groups/utils/get-group-initials";
import { Icon } from "@/shared/components/icon";
import { radius, spacing } from "@/shared/theme/theme";

const Header = () => {
  const { colors } = useCurrentTheme();
  const { selectedGroup } = useGroupsProvider();
  const selectedGroupName = selectedGroup?.name ?? "No Group Selected";
  const selectedGroupDescription = selectedGroup?.description ?? "No Description Available";
  const groupInitials = getGroupInitials(selectedGroupName);

  const showGroupActions = () => {
    if (!selectedGroup) return;

    router.push({
      pathname: "/(app-protected)/group/[groupId]",
      params: { groupId: selectedGroup.id },
    });
  };

  return (
    <View style={[styles.container]}>
      <Pressable
        disabled={!selectedGroup}
        onPress={showGroupActions}
        style={({ pressed }) => [styles.switcher, { opacity: pressed ? 0.6 : 1 }]}
      >
        <View
          style={[styles.avatar, { backgroundColor: colors.accentSoft, borderRadius: radius.md }]}
        >
          <ThemedText variant="header" style={[{ color: colors.accent }]}>
            {groupInitials}
          </ThemedText>
        </View>

        <View style={styles.groupDetails}>
          <View style={styles.nameRow}>
            <ThemedText variant="header" numberOfLines={1}>
              {selectedGroupName}
            </ThemedText>
          </View>
          <ThemedText variant="tag" numberOfLines={1}>
            {selectedGroupDescription}
          </ThemedText>
        </View>
        <Icon name="dots-three" weight="bold" size={30} color={colors.icon} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switcher: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[12],
  },
  avatar: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  groupDetails: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
});

export { Header };
