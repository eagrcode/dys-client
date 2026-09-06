import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { type ReactNode, type Ref } from "react";
import { radius } from "@/shared/theme/theme";
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type InputAppearance = "outlined" | "plain";
type BorderThickness = "hairline" | number;

type InputProps = TextInputProps & {
  ref?: Ref<TextInput>;
  appearance?: InputAppearance;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  borderThickness?: BorderThickness;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Input({
  ref,
  appearance = "outlined",
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  borderThickness = 1,
  ...textInputProps
}: InputProps) {
  const { colors } = useCurrentTheme();
  const isOutlined = appearance === "outlined";

  return (
    <View
      style={[
        styles.container,
        isOutlined && {
          borderWidth: borderThickness === "hairline" ? StyleSheet.hairlineWidth : borderThickness,
          borderColor: colors.border.primary,
          borderRadius: radius.md,
          gap: 12,
          padding: 12,
        },
        containerStyle,
      ]}
    >
      {leftIcon}
      <TextInput
        {...textInputProps}
        ref={ref}
        style={[styles.input, { color: colors.text.primary }, inputStyle]}
        placeholderTextColor={colors.text.muted}
      />
      {rightIcon}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    minWidth: 0,
    alignSelf: "stretch",
    padding: 0,
    margin: 0,
    fontSize: 16,
    fontFamily: "HankenGrotesk_400Regular",
    letterSpacing: 0.5,
  },
});
