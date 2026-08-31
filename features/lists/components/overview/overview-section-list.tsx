import {
  ListType,
  LIST_TYPES,
  ListTypeIcon,
  ListTypeLabel,
} from "../../constants/list-types-config";
import { Icon } from "@/shared/components/icon";
import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { useRouter } from "expo-router";
import { SectionList, View, StyleSheet } from "react-native";
import { OverviewRow } from "./overview-row";
import { spacing } from "@/shared/theme/theme";
import type { List } from "../../types/t-list";

type Props = {
  lists: List[];
};

type Section = {
  type: ListType;
  title: ListTypeLabel;
  icon: ListTypeIcon;
  data: List[];
};

const LIST_TYPES_ARRAY = Object.keys(LIST_TYPES) as ListType[];

export function OverviewSectionList({ lists }: Props) {
  const router = useRouter();

  const sections: Section[] = LIST_TYPES_ARRAY.map((type) => ({
    type,
    title: LIST_TYPES[type].label,
    icon: LIST_TYPES[type].icon,
    data: lists
      .filter((list) => list.list_type === type)
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)),
  })).filter((section) => section.data.length > 0);

  const firstSectionType = sections[0]?.type;

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item: List) => item.id}
      renderSectionHeader={({ section }) => (
        <SectionHeader section={section} isFirst={section.type === firstSectionType} />
      )}
      renderItem={({ item }: { item: List }) => (
        <OverviewRow
          list={item}
          onPress={() =>
            router.push({
              pathname: "/(app-protected)/lists/[listId]/detail",
              params: {
                listId: item.id,
              },
            })
          }
        />
      )}
    />
  );
}

function SectionHeader({ section, isFirst }: { section: Section; isFirst: boolean }) {
  const { colors } = useCurrentTheme();

  return (
    <View
      style={[
        sectionHeaderStyles.container,
        !isFirst && {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          paddingTop: spacing[12],
        },
      ]}
    >
      <Icon name={section.icon} size={25} color={colors.icon} />
      <ThemedText variant="subHeader">{section.title}</ThemedText>
      <ThemedText variant="tag" style={{ marginTop: 2, marginLeft: spacing[8] }}>
        {section.data.length}
      </ThemedText>
    </View>
  );
}

const sectionHeaderStyles = StyleSheet.create({
  container: {
    gap: spacing[8],
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[8],
    paddingHorizontal: spacing[16],
    paddingRight: spacing[24],
  },
});
