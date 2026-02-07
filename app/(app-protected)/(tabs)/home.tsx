import { StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useGroups } from "@/hooks/queries/useGroups";
import { useGroupById } from "@/hooks/queries/useGroupById";
import SignOut from "@/components/ui/sign-out";

export default function HomeScreen() {
  const { selectedGroup, switchGroup } = useGroupsProvider();
  const { data: groupDetails, isLoading: groupDetailsLoading } = useGroupById(
    selectedGroup?.id || "",
  );

  console.log("HomeScreen: selectedGroup", selectedGroup);

  if (groupDetailsLoading) {
    return (
      <ThemedView style={styles.titleContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        Group description: {groupDetails?.description}
      </ThemedText>

      <SignOut />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
