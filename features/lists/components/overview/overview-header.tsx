import { BackButton } from "@/shared/components/back-button";
import { Icon } from "@/shared/components/icon";
import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { useRouter } from "expo-router";
import { View, Pressable, StyleSheet } from "react-native";
import { spacing } from "@/shared/theme/theme";

export function Header({ isLoading, isFetching }: { isLoading: boolean; isFetching: boolean }) {
  const router = useRouter();
  const { colors } = useCurrentTheme();

  return (
    <View style={styles.header}>
      <BackButton type="left" />
      <ThemedText variant="header">Lists</ThemedText>
      <Pressable
        disabled={isLoading || isFetching}
        onPress={() => router.push("/(app-protected)/lists/create-list")}
        hitSlop={10}
        style={({ pressed }) => [{ opacity: pressed || isLoading || isFetching ? 0.7 : 1 }]}
      >
        <Icon name="list-plus" size={25} fill={colors.accent.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[16],
  },
});
