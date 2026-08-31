import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import type { StyleProp, ViewStyle, ViewProps } from "react-native";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing, layout } from "../theme/theme";

type Props = ViewProps & {
  style?: StyleProp<ViewStyle>;
  header?: React.ReactNode;
  children: React.ReactNode;
  horizontalInset?: "screen" | "none";
  isSecondary?: boolean;
};

export const ThemedView = ({
  header = null,
  style,
  children,
  horizontalInset = "screen",
  isSecondary = false,
  ...otherProps
}: Props) => {
  const { colors } = useCurrentTheme();
  const insets = useSafeAreaInsets();
  const horizontalPadding = horizontalInset === "screen" ? layout.screenPadding : 0;

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: insets.top + layout.screenPadding,
          paddingBottom: insets.bottom + layout.screenPadding,
          backgroundColor: isSecondary ? colors.backgroundSecondary : colors.background,
        },
        style,
      ]}
      {...otherProps}
    >
      {header && (
        <>
          <View
            style={{
              paddingHorizontal: horizontalPadding,
              minHeight: 30,
              justifyContent: "center",
            }}
          >
            {header}
          </View>
          <View
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border,
              marginTop: spacing[16],
              marginBottom: layout.headerBottomMargin,
            }}
          ></View>
        </>
      )}
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          gap: layout.contentGap,
          paddingHorizontal: horizontalPadding,
        }}
      >
        {children}
      </View>
    </View>
  );
};
