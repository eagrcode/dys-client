import { ListType } from "../../constants/list-types-config";
import { View, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { spacing, radius } from "@/shared/theme/theme";

type Props = {
  listTypeFilter: ListType | "all";
  setListTypeFilter: React.Dispatch<React.SetStateAction<ListType | "all">>;
};

type FilterOption = {
  label: string;
  value: ListType | "all";
};

const FILTER_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Todo", value: "todo" },
  { label: "Shopping", value: "shopping" },
  { label: "General", value: "other" },
];

export function ListSectionFilter({ listTypeFilter, setListTypeFilter }: Props) {
  const { colors } = useCurrentTheme();

  const selectedValue = listTypeFilter;
  const focusedStyles = {
    pressable: {
      backgroundColor: colors.background.layer3,
    },
    text: {
      opacity: 1,
    },
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing[8],
      }}
    >
      {FILTER_OPTIONS.map(({ label, value }) => (
        <Pressable
          key={value}
          onPress={() => setListTypeFilter(value)}
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: spacing[8],
            paddingHorizontal: spacing[12],
            borderWidth: 1,
            borderColor: colors.border.primary,
            borderRadius: radius.full,
            ...(selectedValue === value ? focusedStyles.pressable : {}),
          }}
        >
          <ThemedText
            variant="tag"
            style={{
              opacity: selectedValue === value ? 1 : 0.7,
              ...(selectedValue === value ? focusedStyles.text : {}),
            }}
          >
            {label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}
