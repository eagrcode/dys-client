import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { ErrorAlert } from "@/shared/components/alert";
import { ThemedText } from "@/shared/components/themed-text";
import { spacing } from "@/shared/theme/theme";
import { useToggleCompleteListItem } from "@/features/lists/mutations/use-toggle-complete";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { Icon } from "@/shared/components/icon";
import type { ListItem } from "@/features/lists/types/t-list";
import type { ListMode } from "@/features/lists/types/t-list-ui";

type ItemRowProps = {
  item: ListItem;
  listId: string;
  listMode: ListMode;
  selected: boolean;
  onToggleSelected: (itemId: string) => void;
};

export function DetailRow({ item, listId, listMode, selected, onToggleSelected }: ItemRowProps) {
  if (listMode === "select-items") {
    return <SelectionRow item={item} selected={selected} onToggleSelected={onToggleSelected} />;
  }

  return (
    <View style={rowStyles.container}>
      <ToggleComplete item={item} listId={listId} disabled={listMode !== "default"} />
      <Row item={item} listId={listId} />
    </View>
  );
}

type ToggleCompleteProps = {
  item: ListItem;
  listId: string;
  disabled: boolean;
};

function ToggleComplete({ item, listId, disabled }: ToggleCompleteProps) {
  const { mutate: toggleCompleteListItem, isPending } = useToggleCompleteListItem();
  const isDisabled = disabled || isPending;

  const toggleItem = () => {
    toggleCompleteListItem(
      { listId, itemId: item.id, completed: !item.completed },
      {
        onError: (error) => {
          ErrorAlert({ title: "Failed to toggle item completion", error });
        },
      },
    );
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={toggleItem}
      hitSlop={15}
      style={[iconButtonStyles.button, { opacity: disabled ? 0.5 : 1 }]}
    >
      <CompletionIcon item={item} />
    </Pressable>
  );
}

function Row({ item, listId }: { item: ListItem; listId: string }) {
  const { colors } = useCurrentTheme();

  return (
    <Pressable
      onPress={() => router.push(`/(app-protected)/lists/${listId}/items/${item.id}`)}
      style={({ pressed }) => [detailsStyles.target, { opacity: pressed ? 0.5 : 1 }]}
    >
      <ItemLabel item={item} />
      <View style={iconButtonStyles.button}>
        <Icon name="chevron-right" size={22} fill={colors.icon.soft} />
      </View>
    </Pressable>
  );
}

type SelectionRowProps = {
  item: ListItem;
  selected: boolean;
  onToggleSelected: (itemId: string) => void;
};

function SelectionRow({ item, selected, onToggleSelected }: SelectionRowProps) {
  const { colors } = useCurrentTheme();

  return (
    <Pressable
      onPress={() => onToggleSelected(item.id)}
      style={({ pressed }) => [rowStyles.container, { opacity: pressed ? 0.5 : 1 }]}
    >
      <View style={[iconButtonStyles.button, rowStyles.disabledCompletion]}>
        <CompletionIcon item={item} />
      </View>
      <View style={selectionStyles.content}>
        <ItemLabel item={item} />
        <Icon
          name={selected ? "checkbox-square" : "checkbox"}
          size={20}
          fill={colors.icon.primary}
        />
      </View>
    </Pressable>
  );
}

function CompletionIcon({ item }: { item: ListItem }) {
  return <Icon name={item.completed ? "check-square" : "square"} size={22} />;
}

function ItemLabel({ item }: { item: ListItem }) {
  return (
    <ThemedText style={labelStyles.text} completed={item.completed} numberOfLines={2}>
      {item.content}
    </ThemedText>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[16],
  },
  disabledCompletion: {
    opacity: 0.5,
  },
});

const iconButtonStyles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});

const detailsStyles = StyleSheet.create({
  target: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[16],
  },
});

const selectionStyles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

const labelStyles = StyleSheet.create({
  text: {
    flex: 1,
    paddingVertical: spacing[12],
  },
});
