import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import type { StyleProp, ViewStyle, ViewProps } from "react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  otherProps?: ViewProps;
};

const ThemedView = ({ style, children, ...otherProps }: Props) => {
  const theme = useCurrentTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
};

export { ThemedView };
