import { StyleSheet, SectionList, View, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { useGroupLists } from "@/hooks/queries/useGroupLists";
import { useRouter } from "expo-router";
import { BackButton } from "@/components/ui/back-button";
import type { List, ListType } from "@/utils/types/T_Lists";
import { LIST_TYPE_ICONS, LIST_TYPE_LABELS, LIST_TYPES } from "@/constants/list-types";

type Section = {
  type: ListType;
  title: string;
  icon: string;
  data: List[];
};

export default function ListsScreen() {
  const { data: lists = [] } = useGroupLists();
  const router = useRouter();

  const sections: Section[] = LIST_TYPES.map((type) => ({
    type,
    title: LIST_TYPE_LABELS[type],
    icon: LIST_TYPE_ICONS[type],
    data: lists.filter((list) => list.list_type === type),
  })).filter((section) => section.data.length > 0);

  return (
    <ThemedView style={styles.container}>
      <Header />
      {sections.length === 0 ? (
        <View style={styles.centered}>
          <ThemedText style={{ opacity: 0.5 }}>No lists yet</ThemedText>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item: List) => item.id}
          renderSectionHeader={({ section }) => <SectionHeader section={section} />}
          renderItem={({ item }: { item: List }) => (
            <ListRow item={item} onPress={() => router.push(`/(app-protected)/list/${item.id}`)} />
          )}
        />
      )}
    </ThemedView>
  );
}

const Header = () => {
  const router = useRouter();
  const theme = useCurrentTheme();

  return (
    <View style={headerStyles.header}>
      <BackButton type="left" size={30} />
      <ThemedText variant="title" style={headerStyles.title}>
        Lists
      </ThemedText>
      <Pressable
        onPress={() => router.push("/(app-protected)/modals/create-list")}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <IconSymbol name={"plus"} size={28} color={theme.colors.accent} />
      </Pressable>
    </View>
  );
};

const SectionHeader = ({ section }: { section: Section }) => {
  const theme = useCurrentTheme();

  return (
    <View style={sectionHeaderStyles.sectionHeader}>
      <IconSymbol name={section.icon as any} size={18} color={theme.colors.icon} />
      <ThemedText variant="defaultSemiBold" style={sectionHeaderStyles.sectionTitle}>
        {section.title}
      </ThemedText>
      <ThemedText style={sectionHeaderStyles.sectionCount}>{section.data.length}</ThemedText>
    </View>
  );
};

const ListRow = ({ item, onPress }: { item: List; onPress: () => void }) => {
  const theme = useCurrentTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        rowStyles.row,
        { backgroundColor: theme.colors.bgLayer1, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={rowStyles.content}>
        <IconSymbol
          name={item.completed ? "check-circle" : "circle"}
          size={25}
          color={item.completed ? theme.colors.accent : theme.colors.icon}
        />
        <View style={rowStyles.text}>
          <ThemedText
            style={
              item.completed ? { textDecorationLine: "line-through", opacity: 0.5 } : undefined
            }
          >
            {item.title}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    letterSpacing: 2,
  },
});

const sectionHeaderStyles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
  },
  sectionCount: {
    fontSize: 14,
    opacity: 0.5,
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 3,
    marginBottom: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  text: {
    flex: 1,
  },
});
