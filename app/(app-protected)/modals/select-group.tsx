import { Pressable, StyleSheet, ScrollView, View } from "react-native";
import { useGroups } from "@/hooks/queries/useGroups";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useRouter } from "expo-router";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { BackButton } from "@/components/ui/back-button";

export default function SelectGroupModal() {
  const { data: groups } = useGroups();
  const { selectedGroup, selectGroup } = useGroupsProvider();
  const router = useRouter();
  const isPresented = router.canGoBack();
  const theme = useCurrentTheme();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText style={{ fontSize: 22, letterSpacing: 2 }} variant="title">
            Your Groups
          </ThemedText>
          <Pressable
            onPress={() => router.push("/(app-protected)/create-group")}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="plus.circle.fill" size={28} color={theme.colors.icon} />
          </Pressable>
        </View>
        {isPresented && <BackButton type="down" />}
      </View>

      <ThemedText variant="subtitle" style={styles.subtitle}>
        {groups.length} group{groups.length !== 1 ? "s" : ""}
      </ThemedText>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group: any) => (
          <GroupTile
            key={group.id}
            group={group}
            isSelected={group.id === selectedGroup}
            onPress={() => {
              selectGroup(group.id);
              router.dismissAll();
            }}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const GroupTile = ({
  group,
  isSelected,
  onPress,
}: {
  group: any;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const theme = useCurrentTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <View
        style={[
          tileStyles.tile,
          {
            borderColor: isSelected ? theme.colors.accent : theme.colors.border,
          },
        ]}
      >
        <View style={tileStyles.content}>
          <ThemedText variant="defaultSemiBold" style={tileStyles.name}>
            {group.name}
          </ThemedText>
          {group.description ? (
            <ThemedText style={tileStyles.description} numberOfLines={2}>
              {group.description}
            </ThemedText>
          ) : null}
        </View>
        {isSelected && <IconSymbol name="chevron.right" size={16} color={theme.colors.accent} />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 40,
  },
});

const tileStyles = StyleSheet.create({
  tile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    opacity: 0.6,
  },
});
