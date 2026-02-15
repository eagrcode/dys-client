import { Pressable, StyleSheet, Text, View } from "react-native";
import { useGroups } from "@/hooks/queries/useGroups";
import { ThemedText } from "@/components/themed-text";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { Link, useRouter } from "expo-router";

export default function Modal() {
  const { data: groups } = useGroups();
  const { selectGroup } = useGroupsProvider();
  const router = useRouter();
  const isPresented = router.canGoBack();

  return (
    <View style={styles.container}>
      {isPresented && (
        <Link href="../" style={styles.closeBtn}>
          <ThemedText type="title">x</ThemedText>
        </Link>
      )}
      <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        You are part of {groups.length} group{groups.length !== 1 ? "s" : ""}.
      </ThemedText>
      {groups.map((group: any) => (
        <Pressable
          key={group.id}
          onPress={() => {
            selectGroup(group.id);
            router.back();
          }}
        >
          <ThemedText type="subtitle">{group.name}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 60,
    right: 32,
  },
});
