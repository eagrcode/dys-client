import { Platform } from "react-native";

export const Accent = {
  accent: "hsl(195, 90%, 50%)",
  accentSoft: "hsl(179, 28%, 48%)",
  accentText: "hsl(195, 90%, 70%)",
  accentDeep: "hsl(195, 90%, 30%)",
  accentGradient: ["hsl(195, 90%, 50%)", "hsl(205, 80%, 50%)"] as const,
};

// export const Accent = {
//   accent: "hsl(267, 92%, 65%)",
//   accentSoft: "#7176a5",
//   accentText: "#7274fe",
//   accentDeep: "#3c36aa",
//   // accentGradient: ["#a855f7", "#ec4899"] as const,
//   accentGradient: ["hsl(195, 90%, 50%)", "hsl(205, 80%, 50%)"] as const,
// };

export const Styling = {
  borderRadius: {
    sm: 8, // chips, keyboard keys
    md: 14, // inputs, list rows, buttons
    lg: 16, // cards, sheet sections
    xl: 22, // dashboard tiles
    xxl: 30, // modals, bottom sheets
    full: 9999, // pills, avatars, tab bar
  },
  shadow: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.07,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.13,
      shadowRadius: 32,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.18,
      shadowRadius: 48,
      elevation: 16,
    },
  },
};

export const Colors = {
  light: {
    text: "#0F0F1A",
    textMuted: "#6a6f74",
    background: "#E0DFE8",
    bgLayer1: "rgba(255, 255, 255, 0.45)",
    bgLayer2: "rgba(255, 255, 255, 0.6)",
    icon: "#c6c6d2",
    placeHolderTextColor: "hsla(260, 6%, 89%, 0.6)",
    tabBar: "#D8D7E2",
    header: "#1c1c21",
    tabIconDefault: "#8e8ea4",
    border: "hsl(0, 0%, 100%)",
    homeTileColors: {
      Lists: "hsla(192, 40%, 60%, 0.70)",
      Calendar: "hsla(48, 40%, 70%, 0.70)  ",
      Albums: "hsla(286, 40%, 70%, 0.70)",
      HearthChat: "hsla(147, 40%, 60%, 0.70)",
    },
  },
  dark: {
    // Text
    text: "hsl(240, 10%, 94%)",
    textMuted: "#797986b3",
    errorText: "#ff6b6b",

    // Backgrounds
    background: "#02060a",
    bgLayer1: "#0d1218",
    bgLayer2: "#181f25",

    // Icons
    icon: "#c6c6d2",

    // Tab Bar
    tabBar: "#050a0f",
    tabIconDefault: "#8e8ea4",
    tabIconSelected: Accent.accent,

    // Header
    header: "#050a0f",

    // Borders
    border: "#ffffff14", // subtle separators, card outlines
    borderStrong: "rgba(255, 255, 255, 0.14)", // input focus rings, emphasized dividers

    // Dashboard
    homeTileColors: {
      Lists: {
        bg: "#4da6bc2e", // hsla(192,45%,52%,0.18) resolved
        border: "#5dbfd640", // hsla(192,60%,60%,0.25) resolved
        icon: "#00c1c4",
        label: "#00c1c4",
      },
      Calendar: {
        bg: "#ccb1582e", // hsla(46,55%,58%,0.18) resolved
        border: "#e2c35d40", // hsla(46,70%,62%,0.25) resolved
        icon: "#fa8b01",
        label: "#fa8b01",
      },
      Albums: {
        bg: "#a05ebd2e", // hsla(284,42%,55%,0.18) resolved
        border: "#b361ce40", // hsla(284,55%,60%,0.25) resolved
        icon: "#ac75ff",
        label: "#ac75ff",
      },
      HearthChat: {
        bg: "#49b67a2e", // hsla(148,42%,50%,0.18) resolved
        border: "#51ca8b40", // hsla(148,55%,56%,0.25) resolved
        icon: "#08af51",
        label: "#08af51",
      },
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
