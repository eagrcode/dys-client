import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Button } from "@/components/ui/button";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useThemePreference } from "@/lib/context/ThemePreferenceProvider";
import { Colors } from "@/constants/theme";

export default function YouScreen() {
  const { user, signOut } = useAuthProvider();
  const { colorScheme, toggleTheme } = useThemePreference();
  const colors = Colors[colorScheme];

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "?";

  return (
    <ThemedView style={styles.container}>
      <View style={styles.profile}>
        <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
          <ThemedText style={styles.initials}>{initials}</ThemedText>
        </View>

        <ThemedText type="title">
          {user ? `${user.firstName} ${user.lastName}` : "Unknown"}
        </ThemedText>
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
      </View>

      <View style={styles.actions}>
        <Button variant="secondaryFill1" onPress={toggleTheme}>
          <View style={styles.row}>
            <IconSymbol
              name={colorScheme === "light" ? "moon.fill" : "sun.max.fill"}
              size={20}
              color={colors.icon}
            />
            <ThemedText>{colorScheme === "light" ? "Dark Mode" : "Light Mode"}</ThemedText>
          </View>
        </Button>

        <Button variant="secondary" onPress={signOut}>
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  profile: {
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  initials: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    opacity: 0.6,
  },
  actions: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  signOutText: {
    color: "#E11D48",
    fontWeight: "600",
  },
});
