import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { View, Pressable, StyleSheet } from "react-native";
import { useDeleteListItems } from "@/features/lists/mutations/use-delete-list-items";
import { useLocalSearchParams } from "expo-router";
import type { ListMode } from "@/features/lists/types/t-list-ui";
import { ErrorAlert } from "@/shared/components/alert";
import { IconSymbol } from "@/shared/components/icon";

type Props = {
  selectedItemIds: Set<string>;
  setSelectedItemIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setListMode: React.Dispatch<React.SetStateAction<ListMode>>;
  onCancelSelection: () => void;
};

export function DeleteItems({
  selectedItemIds,
  setSelectedItemIds,
  setListMode,
  onCancelSelection,
}: Props) {
  const theme = useCurrentTheme();
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { mutate: deleteListItems, isPending: isDeletePending } = useDeleteListItems();

  const count = selectedItemIds.size;
  const btnText =
    count === 0 ? "Select items" : `Delete ${count} ${count === 1 ? "item" : "items"}`;

  const onDeletePress = () => {
    deleteListItems(
      { listId, itemIds: [...selectedItemIds] },
      {
        onSuccess: () => {
          onCancelSelection();
        },
        onError: (error) => {
          ErrorAlert({
            title: "Failed to delete items",
            error,
          });
        },
      },
    );
  };

  return (
    <View style={deleteItemsBtnStyles.container}>
      <Pressable
        style={[
          deleteItemsBtnStyles.btn,
          {
            backgroundColor: theme.colors.bgLayer3,
            borderRadius: theme.radius.full,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={onDeletePress}
        disabled={isDeletePending}
      >
        <IconSymbol name="delete-forever" size={30} color={theme.colors.danger} />
      </Pressable>
      <ThemedText>{btnText}</ThemedText>
    </View>
  );
}

const deleteItemsBtnStyles = StyleSheet.create({
  container: {
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
