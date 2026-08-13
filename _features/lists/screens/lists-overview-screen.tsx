import { StyleSheet, SectionList, View, ActivityIndicator } from "react-native";
import { Header } from "@/_features/lists/components/overview/header";
import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useGroupLists } from "@/_features/lists/hooks/use-lists";
import { useRouter } from "expo-router";
import RetryFetch from "@/_shared/components/retry-fetch";
import { ActionRow } from "@/_shared/components/action-row";
import { LIST_TYPES } from "@/_features/lists/constants/list-types-config";
import type {
  ListType,
  ListTypeIcon,
  ListTypeLabel,
} from "@/_features/lists/constants/list-types-config";
import type { List } from "@/_features/lists/types/t-list";

type Section = {
  type: ListType;
  title: ListTypeLabel;
  icon: ListTypeIcon;
  data: List[];
};

const LIST_TYPES_ARRAY = Object.keys(LIST_TYPES) as ListType[];

function ListsOverviewScreen() {
  const { data: lists = [], error, isPending, isError, refetch, isFetching } = useGroupLists();
  const router = useRouter();
  const theme = useCurrentTheme();

  const filterAndSortLists = (type: ListType) => {
    const filteredLists = lists.filter((list) => list.list_type === type);
    const sortedLists = filteredLists.sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1,
    );
    return sortedLists;
  };

  const sections: Section[] = LIST_TYPES_ARRAY.map((type) => ({
    type,
    title: LIST_TYPES[type].label,
    icon: LIST_TYPES[type].icon,
    data: filterAndSortLists(type),
  })).filter((section) => section.data.length > 0);

  let content: React.ReactNode;

  if (isPending) {
    content = (
      <View style={styles.centered}>
        <ActivityIndicator
          style={{ transform: [{ scale: 1.2 }] }}
          size="small"
          color={theme.colors.accent}
        />
      </View>
    );
  } else if (isError) {
    content = <RetryFetch error={error} refetch={refetch} isFetching={isFetching} type="lists" />;
  } else if (lists.length === 0) {
    content = (
      <View style={styles.centered}>
        <ThemedText style={{ opacity: 0.5 }}>No lists yet</ThemedText>
      </View>
    );
  } else {
    content = (
      <SectionList
        sections={sections}
        keyExtractor={(item: List) => item.id}
        renderSectionHeader={({ section }) => <SectionHeader section={section} />}
        renderItem={({ item }: { item: List }) => (
          <ActionRow
            completed={item.completed}
            icon={item.completed ? "check-circle" : "circle"}
            label={item.title}
            background="bgLayer2"
            style={{ marginBottom: 8 }}
            onPress={() =>
              router.push({
                pathname: "/(app-protected)/lists/[listId]/detail",
                params: {
                  listId: item.id,
                  title: item.title,
                  listType: item.list_type,
                  createdAt: item.created_at,
                },
              })
            }
          />
        )}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header isLoading={isPending} isFetching={isFetching} />
      {content}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

function SectionHeader({ section }: { section: Section }) {
  const theme = useCurrentTheme();

  return (
    <View style={sectionHeaderStyles.sectionHeader}>
      <IconSymbol name={section.icon} size={18} color={theme.colors.icon} />
      <ThemedText variant="subtitle" style={sectionHeaderStyles.sectionTitle}>
        {section.title}
      </ThemedText>
      <ThemedText style={sectionHeaderStyles.sectionCount}>{section.data.length}</ThemedText>
    </View>
  );
}

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
