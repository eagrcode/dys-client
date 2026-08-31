import { ThemedText } from "@/shared/components/themed-text";
import { Input } from "@/shared/components/input";
import { Button } from "@/shared/components/button";
import { ThemedView } from "@/shared/components/themed-view";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useCreateList } from "@/features/lists/mutations/use-create-list";
import { LIST_TYPES, type ListType } from "@/features/lists/constants/list-types-config";
import { Icon } from "@/shared/components/icon";
import { ErrorAlert } from "@/shared/components/alert";
import { BackButton } from "@/shared/components/back-button";
import { radius, spacing } from "@/shared/theme/theme";

const H_GAP = spacing[12];
const LIST_TYPES_ARRAY = Object.keys(LIST_TYPES) as ListType[];

export function CreateListScreen() {
  const { colors } = useCurrentTheme();
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ListType>("todo");
  const { mutate: createList, isPending: isCreatePending } = useCreateList();

  const canSubmit = newTitle.trim().length > 0;
  const buttonDisabled = !canSubmit || isCreatePending;
  const inputIcon = LIST_TYPES[newType].icon;
  const titleText =
    LIST_TYPES[newType].label !== "General" ? `New ${LIST_TYPES[newType].label} List` : "New List";

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createList(
      { title: newTitle.trim(), listType: newType },
      {
        onError: (error) => {
          ErrorAlert({
            title: "Failed to create list",
            error: error,
          });
        },
      },
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <BackButton type={"left"} />
        <ThemedText variant="subHeader">Choose List type</ThemedText>
      </View>

      <View style={styles.selectorContainer}>
        {LIST_TYPES_ARRAY.map((type) => (
          <Pressable
            key={type}
            onPress={() => setNewType(type)}
            style={[
              styles.typeSelector,
              {
                backgroundColor: newType === type ? colors.bgLayer2 : "transparent",
                borderRadius: radius.sm,
              },
            ]}
          >
            <Icon
              name={LIST_TYPES[type].icon}
              size={20}
              color={newType === type ? colors.text : colors.textMuted}
            />
            <ThemedText
              style={{
                color: newType === type ? colors.text : colors.textMuted,
                flex: 1,
              }}
            >
              {LIST_TYPES[type].label}
            </ThemedText>
            <Icon
              name={newType === type ? "check-circle" : "circle"}
              size={18}
              color={newType === type ? colors.text : colors.textMuted}
              weight={newType === type ? "fill" : "regular"}
            />
          </Pressable>
        ))}
      </View>

      <ThemedText variant="subHeader">{titleText}</ThemedText>

      <Input
        leftIcon={<Icon name={inputIcon} size={20} color={colors.text} />}
        size="md"
        radius="sm"
        value={newTitle}
        onChangeText={setNewTitle}
        editable={!isCreatePending}
        autoFocus
        placeholder="Title"
        maxLength={100}
        autoCapitalize="sentences"
      />

      <Button
        variant="primary"
        onPress={handleCreate}
        loading={isCreatePending}
        disabled={buttonDisabled}
      >
        <ThemedText variant="button" style={{ color: colors.onAccent }}>
          Create List
        </ThemedText>
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: H_GAP,
  },
  selectorContainer: {
    gap: spacing[8],
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: H_GAP,
    paddingVertical: spacing[12],
    paddingHorizontal: H_GAP,
  },
});
