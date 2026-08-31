import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { useDeleteListItems } from "@/features/lists/mutations/use-delete-list-items";
import { ErrorAlert } from "@/shared/components/alert";
import { Icon } from "@/shared/components/icon";
import { spacing, radius } from "@/shared/theme/theme";

type Props = {
  listId: string;
  selectedItemIds: Set<string>;
  onCancelSelection: () => void;
};

export function DeleteItems({ listId, selectedItemIds, onCancelSelection }: Props) {
  const { colors } = useCurrentTheme();
  const { mutate: deleteListItems, isPending: isDeletePending } = useDeleteListItems();

  const count = selectedItemIds.size;
  const btnText =
    count === 0 ? "Select items" : `Delete ${count} ${count === 1 ? "item" : "items"}`;

  const onDeletePress = () => {
    Alert.alert("Delete Items", `Are you sure you want to delete ${count} items?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(),
      },
    ]);
  };

  const confirmDelete = () => {
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
            backgroundColor: colors.bgLayer3,
            borderRadius: radius.full,
            borderColor: colors.border,
          },
        ]}
        onPress={onDeletePress}
        disabled={isDeletePending || count === 0}
      >
        <Icon name="trash" size={30} color={colors.danger} />
      </Pressable>
      <ThemedText>{btnText}</ThemedText>
    </View>
  );
}

const deleteItemsBtnStyles = StyleSheet.create({
  container: {
    gap: spacing[8],
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacing[16],
  },
});
