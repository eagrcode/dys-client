import {
  ListType,
  LIST_TYPES,
  ListTypeIcon,
  ListTypeLabel,
} from "../../constants/list-types-config";
import { useRouter } from "expo-router";
import { SectionList } from "react-native";
import { OverviewRow } from "./overview-row";
import { spacing } from "@/shared/theme/theme";
import type { List } from "../../types/t-list";

type Props = {
  lists: List[];
  listTypeFilter: ListType | "all";
};

type Section = {
  type: ListType;
  title: ListTypeLabel;
  icon: ListTypeIcon;
  data: List[];
};

const LIST_TYPES_ARRAY = Object.keys(LIST_TYPES) as ListType[];

export function OverviewSectionList({ lists, listTypeFilter }: Props) {
  const router = useRouter();

  const sections: Section[] = LIST_TYPES_ARRAY.map((type) => ({
    type,
    title: LIST_TYPES[type].label,
    icon: LIST_TYPES[type].icon,
    data: lists
      .filter(
        (list) => list.list_type === type && (listTypeFilter === "all" || type === listTypeFilter),
      )
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)),
  })).filter((section) => section.data.length > 0);

  const firstRow = sections[0]?.data[0];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item: List) => item.id}
      contentContainerStyle={{ paddingHorizontal: spacing[16] }}
      // renderSectionHeader={({ section }) => (
      //   <SectionHeader section={section} isFirst={section.type === firstSectionType} />
      // )}
      renderItem={({ item }: { item: List }) => (
        <OverviewRow
          list={item}
          isFirst={item.id === firstRow?.id}
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

// function SectionHeader({ section, isFirst }: { section: Section; isFirst: boolean }) {
//   const { colors } = useCurrentTheme();

//   return (
//     <View
//       style={[
//         sectionHeaderStyles.container,
//         !isFirst && {
//           borderTopWidth: StyleSheet.hairlineWidth,
//           borderTopColor: colors.border.primary,
//           paddingTop: spacing[16],
//         },
//       ]}
//     >
//       <Icon name={section.icon} size={25} fill={colors.icon.primary} />
//       <ThemedText variant="subHeader">{section.title}</ThemedText>
//       <ThemedText variant="tag" style={{ marginTop: 2, marginLeft: spacing[8] }}>
//         {section.data.length}
//       </ThemedText>
//     </View>
//   );
// }

// const sectionHeaderStyles = StyleSheet.create({
//   container: {
//     gap: spacing[8],
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: spacing[16],
//   },
// });
