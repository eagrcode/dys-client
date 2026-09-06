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
  const { colors } = useCurrentTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemedView>
      <View style={styles.content}>
        <ThemedText variant="header" style={[styles.title, { color: colors.accent.primary }]}>
          HearthLink
        </ThemedText>

        <ThemedText style={styles.tagline}>
          For couples, households, and the groups that matter most.
        </ThemedText>

        <Pills />
      </View>

      <View style={styles.buttons}>
        <Button variant="primary" onPress={() => router.push("/(public)/sign-up")}>
          <ThemedText variant="button" style={{ color: colors.text.onAccent }}>
            Create Account
          </ThemedText>
        </Button>

        <Button variant="secondary" onPress={() => router.push("/(public)/sign-in")}>
          <ThemedText variant="button" style={{ color: colors.text.primary }}>
            Log In
          </ThemedText>
        </Button>
      </View>
    </ThemedView>
  );
}

function Pills() {
  const { colors } = useCurrentTheme();

  return (
    <View style={pillStyles.container}>
      {PILL_CONTENT.map((pill) => (
        <View
          key={pill}
          style={[
            pillStyles.pill,
            {
              backgroundColor: colors.background.layer1,
              borderColor: colors.border.primary,
            },
          ]}
        >
          <ThemedText variant="body" style={{ color: colors.text.soft }}>
            {pill}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing[16],
    maxWidth: "80%",
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
