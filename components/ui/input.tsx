import { type Ref } from "react";
import { useTheme } from "@/hooks/use-theme";
import {
  TextInput,
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type KeyboardTypeOptions,
} from "react-native";

type InputProps = {
  ref?: Ref<TextInput>;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
  autoComplete?: string;
  editable?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<TextStyle>;
  onSubmitEditing?: () => void;
  submitBehavior?: "submit" | "blurAndSubmit" | "newline";
  textContentType?:
    | "none"
    | "emailAddress"
    | "password"
    | "username"
    | "name"
    | "givenName"
    | "familyName";
};

export function Input({
  ref,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  inputMode,
  autoComplete,
  textContentType,
  editable,
  autoFocus = false,
  style,
  onSubmitEditing,
  submitBehavior,
}: InputProps) {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <TextInput
      ref={ref}
      style={[
        styles.base,
        {
          borderColor: colors.border,
          color: colors.text,
          borderRadius: theme.radius.sm,
        },
        style,
      ]}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      inputMode={inputMode}
      autoComplete={autoComplete as any}
      textContentType={textContentType}
      editable={editable}
      autoFocus={autoFocus}
      onSubmitEditing={onSubmitEditing}
      submitBehavior={submitBehavior}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    // flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    backgroundColor: "transparent",
    borderWidth: 1,
  },
});
