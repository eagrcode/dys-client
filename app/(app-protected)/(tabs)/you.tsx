import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { Button } from "@/_shared/components/button";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useThemePreference } from "@/_shared/providers/theme-mode-provider";
import { StyleSheet, View } from "react-native";

export default function YouScreen() {
  const { user, signOut } = useAuthProvider();
  const { toggleMode } = useThemePreference();
  const theme = useCurrentTheme();

  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : "?";

  return (
    <ThemedView style={styles.container}>
      <View style={styles.profile}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.accent }]}>
          <ThemedText style={styles.initials}>{initials}</ThemedText>
        </View>

        <ThemedText variant="title">
          {user ? `${user.first_name} ${user.last_name}` : "Unknown"}
        </ThemedText>
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
      </View>

      <View style={styles.actions}>
        <Button variant="secondaryFill1" onPress={toggleMode}>
          <View style={styles.row}>
            <IconSymbol
              name={theme.scheme === "light" ? "moon.fill" : "sun.max.fill"}
              size={20}
              color={theme.colors.icon}
            />
            <ThemedText>{theme.scheme === "light" ? "Dark Mode" : "Light Mode"}</ThemedText>
          </View>
        </Button>
        <Button variant="secondary" onPress={signOut}>
          <ThemedText style={{ color: theme.colors.danger }}>Sign Out</ThemedText>
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  profile: {
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 36,
  },
  email: {
    fontSize: 16,
    opacity: 0.6,
  },
  actions: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
