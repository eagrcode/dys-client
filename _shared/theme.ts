import { Platform } from "react-native";

export const Accent = {
  accent: "#FF8A4C",
  accentSoft: "rgba(255, 138, 76, 0.16)",
  accentText: "#6DD6FF",
  accentDeep: "#0E7490",
  accentGradient: ["#FF9A5F", "#FF6B3D"] as const,

  violet: "#A879FF",
  violetSoft: "rgba(168, 121, 255, 0.16)",
  violetGradient: ["#A879FF", "#7C3AED"] as const,

  cyan: "#6DD6FF",
  cyanSoft: "rgba(109, 214, 255, 0.14)",

  success: "#70E0A3",
  warning: "#FFB86B",
  danger: "#FF6B7A",
};

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

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
};

export const Colors = {
  light: {
    // Accents
    accent: "#E86F4A",
    accentSoft: "rgba(232, 111, 74, 0.14)",
    accentText: "#0EA5E9",
    accentDeep: "#9A3F27",
    accentGradient: ["#FF9A5F", "#E86F4A"] as const,

    violet: "#7C3AED",
    violetSoft: "rgba(124, 58, 237, 0.12)",
    violetGradient: ["#A879FF", "#7C3AED"] as const,

    cyan: "#0EA5E9",
    cyanSoft: "rgba(14, 165, 233, 0.12)",

    success: "#2FA66A",
    warning: "#D9822B",
    danger: "#D94A5D",

    // Text
    text: "#171717",
    textSoft: "#4F4A45",
    textMuted: "#7A736B",
    textDisabled: "#AAA39A",
    errorText: "#D94A5D",

    // Backgrounds
    background: "#F7F4EE",
    bgLayer1: "#FFFFFF",
    bgLayer2: "#F0ECE4",
    bgLayer3: "#E8E1D7",

    // Screen Gradients
    screenGradient: ["#F7F4EE", "#EFEAE2", "#F7F4EE"] as const,
    homeGradient: ["#FFF8EF", "#EFE8DF", "#F7F4EE"] as const,

    // Ambient Glow
    ambientGlowPrimary: "#E86F4A",
    ambientGlowSecondary: "#7C3AED",

    // Icons
    icon: "#5E5A55",
    iconAccent: "#E86F4A",

    // Tab Bar
    tabBar: "#FFFFFF",
    tabIconDefault: "#8A8179",
    tabIconSelected: "#E86F4A",

    // Header
    header: "#FFFFFF",

    // Borders
    border: "rgba(23, 23, 23, 0.08)",
    borderStrong: "rgba(23, 23, 23, 0.16)",

    // Dashboard
    homeTileColors: {
      Lists: {
        bg: "rgba(14, 165, 233, 0.12)",
        border: "rgba(14, 165, 233, 0.22)",
        icon: "#0EA5E9",
        label: "#0EA5E9",
      },
      Calendar: {
        bg: "rgba(232, 111, 74, 0.12)",
        border: "rgba(232, 111, 74, 0.22)",
        icon: "#E86F4A",
        label: "#E86F4A",
      },
      Albums: {
        bg: "rgba(124, 58, 237, 0.12)",
        border: "rgba(124, 58, 237, 0.22)",
        icon: "#7C3AED",
        label: "#7C3AED",
      },
      HearthChat: {
        bg: "rgba(47, 166, 106, 0.12)",
        border: "rgba(47, 166, 106, 0.22)",
        icon: "#2FA66A",
        label: "#2FA66A",
      },
    },
  },

  dark: {
    // Accents
    accent: Accent.accent,
    accentSoft: Accent.accentSoft,
    accentText: Accent.accentText,
    accentDeep: Accent.accentDeep,
    accentGradient: Accent.accentGradient,

    violet: Accent.violet,
    violetSoft: Accent.violetSoft,
    violetGradient: Accent.violetGradient,

    cyan: Accent.cyan,
    cyanSoft: Accent.cyanSoft,

    success: Accent.success,
    warning: Accent.warning,
    danger: Accent.danger,

    // Text
    text: "#F4F6FA",
    textSoft: "#B8BECC",
    textMuted: "#7E8798",
    textDisabled: "#565F70",
    errorText: Accent.danger,

    // Backgrounds
    background: "hsl(226, 55%, 6%)",
    bgLayer1: "hsl(224, 33%, 10%)",
    bgLayer2: "hsl(222, 30%, 14%)",
    bgLayer3: "hsl(223, 28%, 16%)",

    // Screen Gradients
    screenGradient: ["#070B18", "#0B1020", "#070B18"] as const,
    homeGradient: ["#090D1B", "#10172A", "#070B18"] as const,

    // Ambient Glow
    ambientGlowPrimary: "#7C3AED",
    ambientGlowSecondary: "#FF6B3D",

    // Icons
    icon: "#C6CAD6",
    iconAccent: Accent.accent,

    // Tab Bar
    tabBar: "hsl(223, 33%, 10%)",
    tabIconDefault: "#8E95A8",
    tabIconSelected: Accent.accent,

    // Header
    header: "#070B18",

    // Borders
    border: "rgba(255, 255, 255, 0.05)",
    borderStrong: "rgba(255, 255, 255, 0.14)",

    // Dashboard
    homeTileColors: {
      Lists: {
        bg: "#171D2E",
        border: "rgba(109, 214, 255, 0.24)",
        icon: "#6DD6FF",
        label: "#6DD6FF",
      },
      Calendar: {
        bg: "rgba(255, 138, 76, 0.13)",
        border: "rgba(255, 138, 76, 0.26)",
        icon: "#FF8A4C",
        label: "#FF8A4C",
      },
      Albums: {
        bg: "rgba(168, 121, 255, 0.13)",
        border: "rgba(168, 121, 255, 0.26)",
        icon: "#A879FF",
        label: "#A879FF",
      },
      HearthChat: {
        bg: "rgba(112, 224, 163, 0.12)",
        border: "rgba(112, 224, 163, 0.24)",
        icon: "#70E0A3",
        label: "#70E0A3",
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
