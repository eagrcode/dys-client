import { StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useGroupById } from "@/hooks/queries/useGroupById";
import SignOut from "@/components/ui/sign-out";

import { useDeleteGroup } from "@/hooks/queries/useDeleteGroup";

export default function HomeScreen() {
  const { selectedGroup } = useGroupsProvider();
  const { data: groupDetails, isLoading: groupDetailsLoading } = useGroupById(selectedGroup || "");
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();

  console.log("Home Screen | Selected group:", JSON.stringify(groupDetails, null, 2));

  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        Group description: {groupDetails?.description}
      </ThemedText>

      <SignOut />
      <Pressable
        onPress={() => deleteGroup(selectedGroup)}
        disabled={isDeleting}
        style={{ marginTop: 20, padding: 10, backgroundColor: "#ff0000", borderRadius: 5 }}
      >
        <ThemedText style={{ color: "#fff" }}>
          {isDeleting ? "Deleting..." : "Delete Group"}
        </ThemedText>
      </Pressable>
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
