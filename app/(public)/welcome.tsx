import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { Button } from "@/shared/components/button";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { radius, spacing } from "@/shared/theme/theme";

const PILL_CONTENT = ["Lists", "Calendar", "Albums", "Chat"];

export default function Welcome() {
  const router = useRouter();
  const theme = useCurrentTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText variant="header" style={[styles.title, { color: theme.colors.accent }]}>
          HearthLink
        </ThemedText>

        <ThemedText
          variant="body"
          style={[styles.tagline, { color: theme.colors.textMuted }]}
        >
          For couples, households, and the groups that matter most.
        </ThemedText>

        <Pills />
      </View>

      <View style={styles.buttons}>
        <Button variant="primary" onPress={() => router.push("/(public)/sign-up")}>
          <ThemedText variant="button" style={{ color: theme.colors.onAccent }}>
            Create Account
          </ThemedText>
        </Button>

        <Button variant="secondary" onPress={() => router.push("/(public)/sign-in")}>
          <ThemedText variant="button" style={{ color: theme.colors.text }}>
            Log In
          </ThemedText>
        </Button>
      </View>
    </ThemedView>
  );
}

const Pills = () => {
  const theme = useCurrentTheme();

  return (
    <View style={pillStyles.container}>
      {PILL_CONTENT.map((pill) => (
        <View
          key={pill}
          style={[
            pillStyles.pill,
            {
              backgroundColor: theme.colors.bgLayer1,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <ThemedText variant="body" style={{ color: theme.colors.textMuted }}>
            {pill}
          </ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[16],
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing[16],
    maxWidth: "90%",
    textAlign: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 45,
    textAlign: "center",
  },
  tagline: {
    textAlign: "center",
  },
  buttons: {
    gap: spacing[16],
  },
});

const pillStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing[8],
  },
  pill: {
    borderWidth: 1,
    paddingHorizontal: spacing[12],
    paddingVertical: 6,
    borderRadius: radius.full,
  },
});
