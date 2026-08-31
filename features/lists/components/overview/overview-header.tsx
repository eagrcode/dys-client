import { BackButton } from "@/shared/components/back-button";
import { IconSymbol } from "@/shared/components/icon";
import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { useRouter } from "expo-router";
import { View, Pressable, StyleSheet } from "react-native";

function Header({ isLoading, isFetching }: { isLoading: boolean; isFetching: boolean }) {
  const router = useRouter();
  const theme = useCurrentTheme();

  return (
    <View style={styles.header}>
      <BackButton type="left" size={30} />
      <ThemedText variant="title" style={styles.title}>
        Lists
      </ThemedText>
      <Pressable
        disabled={isLoading || isFetching}
        onPress={() => router.push("/(app-protected)/lists/create-list")}
        style={({ pressed }) => [{ opacity: pressed || isLoading || isFetching ? 0.6 : 1 }]}
      >
        <IconSymbol name={"plus"} size={28} color={theme.colors.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    letterSpacing: 2,
  },
});

export { Header };
