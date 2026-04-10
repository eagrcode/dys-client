import { Text, type TextProps, type TextStyle } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type TextType = "default" | "title" | "defaultSemiBold" | "subtitle" | "link" | "button";

export type ThemedTextProps = TextProps & {
  type?: TextType;
};

export function ThemedText({ style, type = "default", ...rest }: ThemedTextProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return <Text style={[{ color: colors.text }, typeStyles[type], style]} {...rest} />;
}

const typeStyles: Record<TextType, TextStyle> = {
  default: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
    letterSpacing: 0.7,
  },
  defaultSemiBold: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    letterSpacing: 0.7,
  },
  button: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    letterSpacing: 0.7,
  },
  title: {
    fontFamily: "Syne_500Medium",
    fontSize: 32,
    letterSpacing: 5,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 18,
    letterSpacing: 0.7,
  },
  link: {
    fontFamily: "DMSans_400Regular",
    lineHeight: 30,
    fontSize: 16,
    letterSpacing: 0.7,
  },
};
