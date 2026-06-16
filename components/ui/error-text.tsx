import { useCurrentTheme } from "@/hooks/use-current-theme";
import { ThemedText } from "../themed-text";

export function ErrorText({ error }: { error: string }) {
  const theme = useCurrentTheme();

  return <ThemedText style={{ color: theme.colors.errorText, fontSize: 14 }}>{error}</ThemedText>;
}
