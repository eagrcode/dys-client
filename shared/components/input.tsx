import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { type ReactNode, type Ref } from "react";
import { controlSize, radius as radiusMap } from "@/shared/theme/theme";
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type InputSize = "sm" | "md" | "lg";
type InputRadius = "sm" | "md" | "lg" | "full";
type InputAppearance = "outlined" | "plain";
type BorderThickness = "hairline" | number;

type InputProps = TextInputProps & {
  ref?: Ref<TextInput>;
  appearance?: InputAppearance;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  paddingHorizontal?: InputSize;
  paddingVertical?: InputSize;
  radius?: InputRadius;
  borderThickness?: BorderThickness;
  size?: InputSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Input({
  ref,
  appearance = "outlined",
  containerStyle,
  inputStyle,
  leftIcon,
  paddingHorizontal,
  paddingVertical,
  radius = "full",
  size = "md",
  rightIcon,
  borderThickness = 1,
  ...textInputProps
}: InputProps) {
  const { colors } = useCurrentTheme();
  const isOutlined = appearance === "outlined";
  const horizontalSize = paddingHorizontal ?? size;
  const verticalSize = paddingVertical ?? size;
  const horizontalPadding = controlSize[horizontalSize].padding;
  const verticalPadding = controlSize[verticalSize].padding;

  return (
    <View
      style={[
        styles.container,
        isOutlined && {
          borderWidth: borderThickness === "hairline" ? StyleSheet.hairlineWidth : borderThickness,
          borderColor: colors.border,
          borderRadius: radiusMap[radius],
          gap: horizontalPadding,
          paddingHorizontal: horizontalPadding,
          paddingVertical: verticalPadding,
        },
        containerStyle,
      ]}
    >
      {leftIcon}
      <TextInput
        {...textInputProps}
        ref={ref}
        style={[styles.input, { color: colors.text }, inputStyle]}
        placeholderTextColor={colors.textMuted}
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
