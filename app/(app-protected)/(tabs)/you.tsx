import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { useThemePreference } from "@/shared/providers/theme-mode-provider";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/shared/theme/theme";

export default function YouScreen() {
  const { user, signOut } = useAuthProvider();
  const { toggleMode } = useThemePreference();
  const theme = useCurrentTheme();

  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : "?";

  return (
    <ThemedView style={styles.container}>
      <View style={styles.profile}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.colors.accent, borderRadius: theme.radius.full },
          ]}
        >
          <ThemedText style={[styles.initials, { color: theme.colors.onAccent }]}>
            {initials}
          </ThemedText>
        </View>

        <ThemedText variant="header">
          {user ? `${user.first_name} ${user.last_name}` : "Unknown"}
        </ThemedText>
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
      </View>

      <View style={styles.actions}>
        <Button variant="secondaryFill1" onPress={toggleMode}>
          <View style={styles.row}>
            <Icon
              name={theme.scheme === "light" ? "moon" : "sun"}
              size={20}
              color={theme.colors.icon}
              weight="fill"
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
    paddingBottom: spacing[16],
  },
  profile: {
    alignItems: "center",
    gap: spacing[16],
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
    gap: spacing[8],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[12],
  },
});
