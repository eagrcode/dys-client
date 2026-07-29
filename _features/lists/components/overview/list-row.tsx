import { IconSymbol } from "@/_shared/components/icon-symbol";
import { ThemedText } from "@/_shared/components/themed-text";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { Pressable, View, StyleSheet } from "react-native";
import { List } from "../../lists-types";

const ListRow = ({ item, onPress }: { item: List; onPress: () => void }) => {
  const theme = useCurrentTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.colors.bgLayer2,
          opacity: pressed ? 0.7 : 1,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadow.sm,
        },
      ]}
    >
      <View style={styles.content}>
        <IconSymbol
          name={item.completed ? "check-circle" : "circle"}
          size={20}
          color={item.completed ? theme.colors.accent : theme.colors.icon}
        />
        <View style={styles.text}>
          <ThemedText
            variant="default"
            style={
              item.completed ? { textDecorationLine: "line-through", opacity: 0.5 } : undefined
            }
          >
            {item.title}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 3,
    marginBottom: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  text: {
    flex: 1,
  },
});

export { ListRow };
