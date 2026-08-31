import { Platform } from "react-native";

export const Accent = {
  accent: "#FF8A4C",
  accentSoft: "rgba(255, 138, 76, 0.16)",
  accentText: "#6DD6FF",
  accentDeep: "#0E7490",
  accentGradient: ["#FF9A5F", "#FF6B3D"] as const,

  violet: "hsl(261, 100%, 74%)",
  violetSoft: "rgba(168, 121, 255, 0.16)",
  violetGradient: ["#A879FF", "#7C3AED"] as const,

  cyan: "#6DD6FF",
  cyanSoft: "rgba(109, 214, 255, 0.14)",

  success: "#70E0A3",
  warning: "#FFB86B",
  danger: "#FF6B7A",
};

export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  36: 36,
  40: 40,
};

export const layout = {
  screenPadding: spacing[16],
  headerBottomMargin: spacing[16],
  contentGap: spacing[16],
};

export const controlSize = {
  sm: {
    padding: spacing[8],
  },
  md: {
    padding: spacing[12],
  },
  lg: {
    padding: spacing[16],
  },
};

export const radius = {
  sm: spacing[8],
  md: spacing[12],
  lg: spacing[16],
  xl: spacing[20],
  "2xl": spacing[24],
  "3xl": spacing[28],
  "4xl": spacing[32],
  full: 9999,
};

export const shadow = {
  tile: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    // shadowBlur: 20,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    shadowBlur: 10,
  },
  xl: {
    shadowColor: "hsl(0, 84%, 34%)",
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
    shadowBlur: 10,
  },
};

export const Colors = {
  light: {
    // Accents
    accent: "#BE5032",
    accentSoft: "rgba(190, 80, 50, 0.13)",
    accentText: "#0878A6",
    accentDeep: "#8A321F",
    accentGradient: ["#E9794F", "#BE5032"] as const,

    violet: "#7C3AED",
    violetSoft: "rgba(124, 58, 237, 0.12)",
    violetGradient: ["#A879FF", "#7C3AED"] as const,

    cyan: "#0878A6",
    cyanSoft: "rgba(8, 120, 166, 0.11)",

    success: "#237E50",
    warning: "#A95E18",
    danger: "#C83D52",

    // Text
    text: "hsl(228, 28%, 14%)",
    textHeader: "hsl(220, 20%, 10%)",
    textSoft: "hsl(226, 16%, 34%)",
    textMuted: "hsl(225, 12%, 48%)",
    textDisabled: "hsl(224, 10%, 67%)",
    errorText: "#C83D52",
    onAccent: "#FFFFFF",

    // Backgrounds
    background: "hsl(225, 35%, 98%)",
    backgroundSecondary: "hsl(225, 30%, 96%)",
    bgLayer1: "hsl(0, 0%, 100%)",
    bgLayer2: "hsl(225, 28%, 94%)",
    bgLayer3: "hsl(225, 24%, 90%)",

    // Screen Gradients
    screenGradient: ["#F8F9FD", "#EEF1F8", "#F8F9FD"] as const,
    homeGradient: ["#FFF8F3", "#F0F2FA", "#F8F9FD"] as const,

    // Ambient Glow
    ambientGlowPrimary: "#E86F4A",
    ambientGlowSecondary: "#7C3AED",

    // Icons
    icon: "hsl(225, 14%, 38%)",
    iconAccent: "#BE5032",

    // Tab Bar
    tabBar: "hsl(0, 0%, 100%)",
    tabIconDefault: "hsl(225, 11%, 52%)",
    tabIconSelected: "#BE5032",

    // Header
    header: "hsl(0, 0%, 100%)",

    // Borders
    border: "rgba(35, 43, 70, 0.09)",
    borderStrong: "rgba(35, 43, 70, 0.17)",
    overlay: "rgba(0, 0, 0, 0.5)",

    // Dashboard
    homeTileColors: {
      Lists: {
        bg: "rgba(8, 120, 166, 0.10)",
        border: "rgba(8, 120, 166, 0.20)",
        icon: "#0878A6",
        label: "#0878A6",
      },
      Calendar: {
        bg: "rgba(190, 80, 50, 0.10)",
        border: "rgba(190, 80, 50, 0.20)",
        icon: "#BE5032",
        label: "#BE5032",
      },
      Albums: {
        bg: "rgba(124, 58, 237, 0.12)",
        border: "rgba(124, 58, 237, 0.22)",
        icon: "#7C3AED",
        label: "#7C3AED",
      },
      Chat: {
        bg: "rgba(35, 126, 80, 0.10)",
        border: "rgba(35, 126, 80, 0.20)",
        icon: "#237E50",
        label: "#237E50",
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
    text: "hsl(220, 35%, 90%)",
    textHeader: "hsl(220, 20%, 93%)",
    textSoft: "#B8BECC",
    textMuted: "#7E8798",
    textDisabled: "#565F70",
    errorText: Accent.danger,
    onAccent: "#FFFFFF",

    // Backgrounds
    background: "hsl(230, 45%, 10%)",
    backgroundSecondary: "hsl(230, 45%, 11%)",

    bgLayer1: "hsl(230, 40%, 13%)",
    bgLayer2: "hsl(230, 40%, 15%)",
    bgLayer3: "hsl(230, 40%, 17%)",

    // Screen Gradients
    screenGradient: ["#070B18", "#0B1020", "#070B18"] as const,
    homeGradient: ["#090D1B", "#10172A", "#070B18"] as const,

    // Ambient Glow
    ambientGlowPrimary: "#7C3AED",
    ambientGlowSecondary: "#FF6B3D",

    // Icons
    icon: "hsl(220, 20%, 75%)",
    iconAccent: Accent.accent,

    // Tab Bar
    tabBar: "hsl(230, 45%, 10%)",
    tabIconDefault: "#8E95A8",
    tabIconSelected: Accent.accent,

    // Header
    header: "#070B18",

    // Borders
    border: "rgba(200, 200, 200, 0.1)",
    borderStrong: "rgba(255, 255, 255, 0.14)",
    overlay: "rgba(0, 0, 0, 0.5)",

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
      Chat: {
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
