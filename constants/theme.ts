import { Platform } from "react-native";

const tintColorLight = "#1dbae2";
const tintColorDark = "#4d9eb3";
const tintColorDarkSoft = "hsla(192, 40%, 50%, 0.50)";
const tintColorLightSoft = "hsla(192, 40%, 50%, 0.50)";
const errorColor = "#ff6b6b";

export const Styling = {
  borderRadius: 6,
  borderRadiusCTA: 12,
};

export const Colors = {
  light: {
    text: "#0F0F1A",
    errorText: errorColor,
    background: "#E0DFE8",
    bgLayer1: "rgba(255, 255, 255, 0.45)",
    bgLayer2: "rgba(255, 255, 255, 0.6)",
    tint: tintColorLight,
    tintSoft: tintColorLightSoft,
    icon: "#c6c6d2",
    placeHolderTextColor: "hsla(260, 6%, 89%, 0.6)",
    tabBar: "#D8D7E2",
    header: "#1c1c21",
    tabIconDefault: "#8e8ea4",
    tabIconSelected: tintColorLight,
    border: "hsl(0, 0%, 100%)",
    homeTileColors: {
      Lists: "hsla(192, 40%, 60%, 0.70)",
      Calendar: "hsla(48, 40%, 70%, 0.70)  ",
      Albums: "hsla(286, 40%, 70%, 0.70)",
      HearthChat: "hsla(147, 40%, 60%, 0.70)",
    },
  },
  dark: {
    text: "#e3e2e5",
    errorText: errorColor,
    background: "#08080F",
    bgLayer1: "rgba(255, 255, 255, 0.1)",
    bgLayer2: "rgba(255, 255, 255, 0.20)",
    tint: tintColorDark,
    tintSoft: tintColorDarkSoft,
    icon: "#c6c6d2",
    placeHolderTextColor: "hsla(260, 6%, 89%, 0.6)",
    tabBar: "hsla(0, 0%, 100%, 0.06)",
    header: "#1c1c21",
    tabIconDefault: "#8e8ea4",
    tabIconSelected: tintColorDark,
    border: "hsla(0, 0%, 100%, 0.10)",
    borderTint: "#1dbae2b3",
    homeTileColors: {
      Lists: "hsla(192, 40%, 60%, 0.70)",
      Calendar: "hsla(48, 40%, 70%, 0.70)  ",
      Albums: "hsla(286, 40%, 70%, 0.70)",
      HearthChat: "hsla(147, 40%, 60%, 0.70)",
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
