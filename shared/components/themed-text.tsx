import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { Text } from "react-native";
import type { TextProps, TextStyle } from "react-native";

type Variant = "tag" | "body" | "header" | "headerLg" | "subHeader" | "button";

type Props = TextProps & {
  variant?: Variant;
  children: React.ReactNode;
  completed?: boolean;
};

export function ThemedText({ style, variant = "body", children, completed, ...rest }: Props) {
  const { colors } = useCurrentTheme();

  const baseStyles = {
    letterSpacing: 0.5,
    color: colors.text,
  };

  const variantStyles: Record<Variant, TextStyle> = {
    tag: {
      fontFamily: "HankenGrotesk_300Light",
      fontSize: 15,
      opacity: 0.8,
    },
    body: {
      fontFamily: "HankenGrotesk_300Light",
      fontSize: 18,
    },
    subHeader: {
      fontFamily: "HankenGrotesk_500Medium",
      fontSize: 20,
    },
    header: {
      fontFamily: "HankenGrotesk_600SemiBold",
      fontSize: 22,
      color: colors.textHeader,
      letterSpacing: 1,
    },
    headerLg: {
      fontFamily: "HankenGrotesk_600SemiBold",
      fontSize: 26,
      color: colors.textHeader,
      letterSpacing: 1,
    },
    button: {
      fontFamily: "HankenGrotesk_600SemiBold",
      fontSize: 18,
    },
  };

  const completedStyle: TextStyle = completed
    ? { textDecorationLine: "line-through", opacity: 0.5 }
    : {};

  return (
    <Text style={[baseStyles, variantStyles[variant], completedStyle, style]} {...rest}>
      {children}
    </Text>
  );
}
