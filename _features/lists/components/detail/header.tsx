import { ThemedText } from "@/_shared/components/themed-text";
import { BackButton } from "@/_shared/components/back-button";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Input } from "@/_shared/components/input";
import { useState } from "react";
import { useRenameList } from "@/_features/lists/hooks/use-rename-list";
import { ErrorAlert } from "@/_shared/components/alert";
import type { ListMode } from "@/_features/lists/types/t-list-ui";

export function Header({
  listId,
  listMode,
  setListMode,
  title,
  onCancelSelection,
}: {
  listId: string;
  listMode: ListMode;
  setListMode: React.Dispatch<React.SetStateAction<ListMode>>;
  title: string;
  onCancelSelection: () => void;
}) {
  const theme = useCurrentTheme();
  const [newTitle, setNewTitle] = useState<string>(title);
  const { mutate: renameList, isPending: isRenamePending } = useRenameList();

  const isSelectMode = listMode === "select-items";
  const isRenaming = listMode === "renaming";
  const isSubmitRenameDisabled = !newTitle.trim() || newTitle === title || isRenamePending;

  const handleSaveRename = () => {
    if (isSubmitRenameDisabled) return;

    renameList(
      { listId, newTitle: newTitle.trim() },
      {
        onError: (mutationError) => {
          ErrorAlert({ title: "Failed to rename list", error: mutationError });
        },
      },
    );
    setListMode("default");
  };

  let headerMid = isRenaming ? (
    <Input value={newTitle} autoFocus onChangeText={setNewTitle} style={styles.input} />
  ) : (
    <ThemedText style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
      {title}
    </ThemedText>
  );

  let headerRight = isSelectMode ? (
    <Pressable onPress={onCancelSelection} hitSlop={10}>
      <IconSymbol name="xmark" size={25} color={theme.colors.icon} />
    </Pressable>
  ) : isRenaming ? (
    <View style={styles.headerRightIcons}>
      <Pressable disabled={isSubmitRenameDisabled} onPress={handleSaveRename} hitSlop={10}>
        <IconSymbol
          name="check"
          size={25}
          color={isSubmitRenameDisabled ? theme.colors.textDisabled : theme.colors.iconAccent}
        />
      </Pressable>
      <Pressable onPress={() => setListMode("default")} hitSlop={10}>
        <IconSymbol name="xmark" size={25} color={theme.colors.icon} />
      </Pressable>
    </View>
  ) : (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(app-protected)/(modals)/list-detail-actions",
          params: { listId, listMode },
        })
      }
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      <IconSymbol name="ellipsis" size={30} color={theme.colors.icon} />
    </Pressable>
  );

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <BackButton type="left" size={30} />
        {headerMid}
        {headerRight}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  title: {
    flex: 1,
    flexShrink: 1,
    fontSize: 20,
    letterSpacing: 1,
  },
  input: {
    flex: 1,
    flexShrink: 1,
    fontSize: 20,
    letterSpacing: 1,
    padding: 0,
    borderWidth: 0,
  },
  headerRightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
