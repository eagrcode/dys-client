import { StyleSheet } from "react-native";
import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { Dashboard } from "@/_shared/components/dashboard";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";

export default function HomeScreen() {
  return (
    <ThemedView variant="home" style={styles.container}>
      <Header />
      <Dashboard />
    </ThemedView>
  );
}

function Header() {
  const { user } = useAuthProvider();

  return (
    <ThemedText variant="subtitle" style={styles.greeting}>
      Welcome back, {user?.first_name ?? "User"}!
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  greeting: {
    fontSize: 20,
  },
});
