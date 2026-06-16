import { useCurrentTheme } from "@/hooks/use-current-theme";
import { StyleProp, Text, type TextStyle } from "react-native";

type Variant = "default" | "soft" | "title" | "defaultSemiBold" | "subtitle" | "link" | "button";

type Props = {
  variant?: Variant;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  numberOfLines?: number;
};

export function ThemedText({
  style,
  variant = "default",
  children,
  numberOfLines,
  ...rest
}: Props) {
  const theme = useCurrentTheme();

  const variantStyles: Record<Variant, TextStyle> = {
    default: {
      fontFamily: "DMSans_400Regular",
      fontSize: 16,
      letterSpacing: 0.7,
      color: theme.colors.text,
    },
    soft: {
      fontFamily: "DMSans_400Regular",
      fontSize: 16,
      letterSpacing: 0.7,
      color: theme.colors.textMuted,
    },
    defaultSemiBold: {
      fontFamily: "DMSans_600SemiBold",
      fontSize: 16,
      letterSpacing: 0.7,
      color: theme.colors.text,
    },
    button: {
      fontFamily: "DMSans_600SemiBold",
      fontSize: 16,
      letterSpacing: 0.7,
      color: theme.colors.text,
    },
    title: {
      fontFamily: "Syne_500Medium",
      fontSize: 32,
      letterSpacing: 5,
      color: theme.colors.text,
    },
    subtitle: {
      fontFamily: "DMSans_400Regular",
      fontSize: 18,
      letterSpacing: 0.7,
      color: theme.colors.text,
    },
    link: {
      fontFamily: "DMSans_400Regular",
      lineHeight: 30,
      fontSize: 16,
      letterSpacing: 0.7,
      color: theme.colors.accent,
    },
  };

  return (
    <Text numberOfLines={numberOfLines} style={[variantStyles[variant], style]} {...rest}>
      {children}
    </Text>
  );
}
