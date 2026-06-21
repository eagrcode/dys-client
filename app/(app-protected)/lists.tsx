import { useState } from "react";
import { StyleSheet, SectionList, View, Pressable, ActivityIndicator, Alert } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useGroupLists } from "@/hooks/queries/useGroupLists";
import { useDeleteList } from "@/hooks/queries/useDeleteList";
import { useRouter } from "expo-router";
import { useCreateList } from "@/hooks/queries/useCreateList";
import { BackButton } from "@/components/ui/back-button";

type ListType = "shopping" | "todo" | "other";

type List = {
  id: string;
  title: string;
  list_type: ListType;
  completed: boolean;
};

type Section = {
  type: ListType;
  title: string;
  icon: string;
  data: List[];
};

const SECTION_CONFIG: Record<ListType, { label: string; icon: string }> = {
  todo: { label: "Todo", icon: "checkmark.circle.fill" },
  shopping: { label: "Shopping", icon: "cart.fill" },
  other: { label: "Other", icon: "list.bullet" },
};

export default function ListsScreen() {
  const theme = useCurrentTheme();
  const { selectedGroup } = useGroupsProvider();
  const { data: lists = [], isLoading: listsLoading } = useGroupLists(selectedGroup || "");
  const { isPending: isCreating } = useCreateList();
  const { mutate: deleteList } = useDeleteList(selectedGroup || "");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const sections = (Object.keys(SECTION_CONFIG) as ListType[])
    .map((type) => ({
      type,
      title: SECTION_CONFIG[type].label,
      icon: SECTION_CONFIG[type].icon,
      data: lists.filter((list: List) => list.list_type === type),
    }))
    .filter((section) => section.data.length > 0);

  const handleDelete = (listId: string, title: string) => {
    Alert.alert("Delete List", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setDeletingId(listId);
          deleteList(listId);
        },
      },
    ]);
  };

  if (listsLoading || isCreating) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </ThemedView>
    );
  }

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
            <ListRow
              item={item}
              deletingId={deletingId}
              onPress={() => router.push(`/(app-protected)/list/${item.id}`)}
              onDelete={() => handleDelete(item.id, item.title)}
            />
          )}
        />
      )}
    </ThemedView>
  );
}

function Header() {
  const router = useRouter();
  const theme = useCurrentTheme();

  return (
    <View style={headerStyles.header}>
      <BackButton type="left" size={24} />
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
}

function SectionHeader({ section }: { section: Section }) {
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
}

function ListRow({
  item,
  deletingId,
  onPress,
  onDelete,
}: {
  item: List;
  deletingId: string | null;
  onPress: () => void;
  onDelete: () => void;
}) {
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
          name={item.completed ? "checkmark.circle.fill" : "circle"}
          size={22}
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
      <Pressable
        onPress={onDelete}
        hitSlop={8}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        {deletingId === item.id ? (
          <ActivityIndicator size="small" color={"#E11D48"} />
        ) : (
          <IconSymbol name="trash" size={18} color="#E11D48" />
        )}
      </Pressable>
    </Pressable>
  );
}

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
