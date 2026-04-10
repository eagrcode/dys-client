import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemedText } from "../themed-text";
import { Colors } from "@/constants/theme";

export function ErrorText({ error }: { error: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return <ThemedText style={{ color: colors.errorText, fontSize: 14 }}>{error}</ThemedText>;
}
