import {
  TextInput,
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type KeyboardTypeOptions,
} from "react-native";
import { Colors } from "@/constants/theme";
import { Styling } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type InputProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
  autoComplete?: string;
  textContentType?:
    | "none"
    | "emailAddress"
    | "password"
    | "username"
    | "name"
    | "givenName"
    | "familyName";
  editable?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<TextStyle>;
};

export function Input({
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
}: InputProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <TextInput
      style={[
        styles.base,
        {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.border,
          color: colors.text,
        },
        style,
      ]}
      placeholder={placeholder}
      placeholderTextColor={colors.placeHolderTextColor}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      inputMode={inputMode}
      autoComplete={autoComplete as any}
      textContentType={textContentType}
      editable={editable}
      autoFocus={autoFocus}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    // flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    borderRadius: Styling.borderRadius,
  },
});
