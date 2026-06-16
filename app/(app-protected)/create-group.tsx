import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import CreateGroup from "@/components/ui/create-group";
import { BackButton } from "@/components/ui/back-button";

export default function CreateGroupScreen() {
  const router = useRouter();
  const isPresented = router.canGoBack();

  return (
    <View style={styles.container}>
      {isPresented && (
        <BackButton
          type="close"
          size={24}
          style={{ position: "absolute", top: 60, right: 16, zIndex: 1 }}
        />
      )}
      <CreateGroup />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
