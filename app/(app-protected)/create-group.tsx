import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import CreateGroup from "@/components/ui/create-group";

export default function CreateGroupScreen() {
  const router = useRouter();
  const isPresented = router.canGoBack();
  const colorScheme = useColorScheme() ?? "light";

  return (
    <View style={styles.container}>
      {isPresented && (
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <IconSymbol name="chevron.down" size={30} color={Colors[colorScheme].icon} />
        </Pressable>
      )}
      <CreateGroup />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeBtn: {
    position: "absolute",
    top: 60,
    right: 16,
    zIndex: 1,
  },
});
