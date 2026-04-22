import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import CreateGroup from "@/components/ui/create-group";
import { BackButton } from "@/components/ui/back-button";

export default function CreateGroupScreen() {
  const router = useRouter();
  const isPresented = router.canGoBack();
  const colorScheme = useColorScheme() ?? "light";

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
