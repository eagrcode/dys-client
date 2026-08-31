import { ThemedText } from "@/shared/components/themed-text";
import { BackButton } from "@/shared/components/back-button";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Input } from "@/shared/components/input";
import { useEffect, useState } from "react";
import { useRenameList } from "@/features/lists/mutations/use-rename-list";
import { ErrorAlert } from "@/shared/components/alert";
import { spacing } from "@/shared/theme/theme";
import { Icon } from "@/shared/components/icon";
import type { ListMode } from "@/features/lists/types/t-list-ui";

export function Header({
  optionsDisabled,
  listId,
  listMode,
  setListMode,
  title,
  onCancelSelection,
}: {
  optionsDisabled: boolean;
  listId: string;
  listMode: ListMode;
  title: string;
  onCancelSelection: () => void;
  setListMode: React.Dispatch<React.SetStateAction<ListMode>>;
}) {
  const { colors } = useCurrentTheme();
  const [newTitle, setNewTitle] = useState<string>(title);
  const { mutate: renameList, isPending: isRenamePending } = useRenameList();

  const isSelectMode = listMode === "select-items";
  const isRenaming = listMode === "renaming";
  const isSubmitRenameDisabled = !newTitle.trim() || newTitle.trim() === title || isRenamePending;

  useEffect(() => {
    if (isRenaming) {
      setNewTitle(title);
    }
  }, [isRenaming, title]);

  const handleSaveRename = () => {
    if (isSubmitRenameDisabled) return;

    renameList(
      { listId, newTitle: newTitle.trim() },
      {
        onSuccess: () => {
          setListMode("default");
        },
        onError: (mutationError) => {
          ErrorAlert({ title: "Failed to rename list", error: mutationError });
        },
      },
    );
  };

  let headerMid = isRenaming ? (
    <Input
      value={newTitle}
      autoFocus
      maxLength={100}
      onChangeText={setNewTitle}
      appearance="plain"
      containerStyle={styles.inputContainer}
      inputStyle={styles.input}
    />
  ) : (
    <ThemedText variant="header" numberOfLines={1}>
      {title}
    </ThemedText>
  );

  let headerRight = isSelectMode ? (
    <Pressable onPress={onCancelSelection} hitSlop={10} style={styles.headerRightIcon}>
      <Icon name="x" size={25} color={colors.icon} />
    </Pressable>
  ) : isRenaming ? (
    <View style={styles.headerRightRenamingIcons}>
      <Pressable disabled={isSubmitRenameDisabled} onPress={handleSaveRename} hitSlop={10}>
        <Icon
          name="check"
          size={25}
          color={isSubmitRenameDisabled ? colors.textDisabled : colors.iconAccent}
          weight="bold"
        />
      </Pressable>
      <Pressable onPress={() => setListMode("default")} hitSlop={10}>
        <Icon name="x" size={25} color={colors.icon} />
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
      hitSlop={10}
      disabled={optionsDisabled}
      style={styles.headerRightIcon}
    >
      <Icon name="dots-three" weight="bold" size={30} color={colors.icon} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <BackButton type="left" />
      {headerMid}
      {headerRight}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[8],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    fontSize: 22,
  },
  headerRightIcon: {
    width: 30,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRightRenamingIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[16],
  },
});
