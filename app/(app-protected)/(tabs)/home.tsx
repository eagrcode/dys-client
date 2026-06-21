import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Dashboard } from "@/components/ui/dashboard";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header />
      <Dashboard />
    </ThemedView>
  );
}

function Header() {
  const { user } = useAuthProvider();

  const greeting = `Welcome back, ${user?.firstName || "User"}!`;

  return (
    <ThemedText variant="subtitle" style={{ fontSize: 20 }}>
      {greeting}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
