import { StyleSheet, SectionList, View, Pressable, ActivityIndicator } from "react-native";
import { Header } from "@/_features/lists/components/overview/header";
import { ListRow } from "@/_features/lists/components/overview/list-row";
import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useGroupLists } from "@/_features/lists/hooks/use-lists";
import { useRouter } from "expo-router";
import RetryFetch from "@/_shared/components/retry-fetch";
import type { List, ListType } from "@/_features/lists/lists-types";
import { LIST_TYPE_ICONS, LIST_TYPE_LABELS, LIST_TYPES } from "@/constants/list-types";

type Section = {
  type: ListType;
  title: string;
  icon: string;
  data: List[];
};

function ListsOverviewScreen() {
  const {
    data: lists = [],
    error,
    isLoading,
    isSuccess,
    isError,
    refetch,
    isFetching,
  } = useGroupLists();
  const router = useRouter();
  const theme = useCurrentTheme();

  const sections: Section[] = LIST_TYPES.map((type) => ({
    type,
    title: LIST_TYPE_LABELS[type],
    icon: LIST_TYPE_ICONS[type],
    data: lists.filter((list) => list.list_type === type),
  })).filter((section) => section.data.length > 0);

  const loadingContent = (
    <View style={styles.centered}>
      <ActivityIndicator
        style={{ transform: [{ scale: 1.2 }] }}
        size="small"
        color={theme.colors.accent}
      />
    </View>
  );

  const noListsContent = (
    <View style={styles.centered}>
      <ThemedText style={{ opacity: 0.5 }}>No lists yet</ThemedText>
    </View>
  );

  const errorContent = (
    <RetryFetch error={error} refetch={refetch} isFetching={isFetching} type="lists" />
  );

  const listsContent = (
    <SectionList
      sections={sections}
      keyExtractor={(item: List) => item.id}
      renderSectionHeader={({ section }) => <SectionHeader section={section} />}
      renderItem={({ item }: { item: List }) => (
        <ListRow item={item} onPress={() => router.push(`/(app-protected)/list/${item.id}`)} />
      )}
    />
  );

  let content = listsContent;

  if (isLoading) {
    content = loadingContent;
  } else if (isError) {
    content = errorContent;
  } else if (isSuccess && lists.length === 0) {
    content = noListsContent;
  }

  return (
    <ThemedView style={styles.container}>
      <Header isLoading={isLoading} isFetching={isFetching} />
      {content}
    </ThemedView>
  );
}

const SectionHeader = ({ section }: { section: Section }) => {
  const theme = useCurrentTheme();

  return (
    <View style={sectionHeaderStyles.sectionHeader}>
      <IconSymbol name={section.icon as any} size={18} color={theme.colors.icon} />
      <ThemedText variant="subtitle" style={sectionHeaderStyles.sectionTitle}>
        {section.title}
      </ThemedText>
      <ThemedText style={sectionHeaderStyles.sectionCount}>{section.data.length}</ThemedText>
    </View>
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

export { ListsOverviewScreen };
