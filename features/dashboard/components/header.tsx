import { IconSymbol } from "@/shared/components/icon";
import { ThemedText } from "@/shared/components/themed-text";
import { router } from "expo-router";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { Pressable, View, StyleSheet } from "react-native";
import { useGroupsProvider } from "@/features/groups/providers/groups-provider";
import { getGroupInitials } from "@/features/groups/utils/get-group-initials";

const Header = () => {
  const theme = useCurrentTheme();
  const { selectedGroup } = useGroupsProvider();
  const selectedGroupName = selectedGroup?.name ?? "No Group Selected";
  const groupInitials = getGroupInitials(selectedGroupName);

  const showGroupActions = () => {
    if (!selectedGroup) return;

    router.push({
      pathname: "/(app-protected)/(modals)/group-actions",
      params: { groupId: selectedGroup.id },
    });
  };

  return (
    <View style={[styles.container]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open actions for ${selectedGroupName}`}
        disabled={!selectedGroup}
        onPress={showGroupActions}
        style={({ pressed }) => [styles.switcher, { opacity: pressed ? 0.6 : 1 }]}
      >
        <View style={[styles.avatar, { backgroundColor: theme.colors.accentSoft }]}>
          <ThemedText style={[styles.initials, { color: theme.colors.accent }]}>
            {groupInitials}
          </ThemedText>
        </View>

        <View style={styles.groupDetails}>
          <ThemedText style={styles.eyebrow} variant="soft">
            Current group
          </ThemedText>
          <View style={styles.nameRow}>
            <ThemedText style={styles.title} variant="defaultSemiBold" numberOfLines={1}>
              {selectedGroupName}
            </ThemedText>
          </View>
        </View>
        <IconSymbol name="chevron-down" size={20} color={theme.colors.icon} />
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
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
  },
  groupDetails: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 18,
    flexShrink: 1,
  },
});

export { Header };
