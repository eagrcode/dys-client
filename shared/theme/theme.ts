// Colors

const TEXT = {
  light: {
    primary: "hsl(228, 28%, 14%)",
    header: "hsl(220, 20%, 10%)",
    soft: "hsl(226, 16%, 34%)",
    muted: "hsl(225, 12%, 48%)",
    disabled: "hsl(224, 10%, 67%)",
  },
  dark: {
    primary: "hsl(220, 35%, 93%)",
    header: "hsl(220, 20%, 95%)",
    soft: "hsla(220, 35%, 85%, 0.8)",
    muted: "hsla(220, 35%, 85%, 0.7)",
    disabled: "hsl(220, 10%, 40%)",
  },
} as const;

const BACKGROUND = {
  light: {
    primary: "hsl(240, 25%, 95%)",
    secondary: "hsl(240, 25%, 93%)",
    layer1: "hsl(240, 25%, 92%)",
    layer2: "hsl(240, 25%, 90%)",
    layer3: "hsl(240, 25%, 88%)",
  },
  dark: {
    primary: "hsl(235, 25%, 13%)",
    secondary: "hsl(235, 25%, 15%)",
    layer1: "hsl(235, 25%, 16%)",
    layer2: "hsl(235, 25%, 18%)",
    layer3: "hsl(235, 25%, 20%)",
  },
} as const;

export const Accent = {
  primary: "hsl(21, 85%, 65%)",
  deep: "hsl(21, 100%, 55%)",
  soft: "hsla(21, 100%, 65%, 0.2)",
  gradient: ["#FF9A5F", "#FF6B3D"] as const,
  success: "#70E0A3",
  warning: "#FFB86B",
  danger: "hsl(354, 100%, 71%)",
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
    accent: {
      primary: "#BE5032",
      deep: "#8A321F",
      soft: "rgba(190, 80, 50, 0.13)",
      gradient: ["#E9794F", "#BE5032"] as const,
      success: "#237E50",
      warning: "#A95E18",
      danger: "#C83D52",
    },

    // Text
    text: {
      primary: TEXT.light.primary,
      header: TEXT.light.header,
      soft: TEXT.light.soft,
      muted: TEXT.light.muted,
      disabled: TEXT.light.disabled,
      error: "#C83D52",
      onAccent: "#FFFFFF",
    },

    // Backgrounds
    background: {
      primary: BACKGROUND.light.primary,
      secondary: BACKGROUND.light.secondary,
      layer1: BACKGROUND.light.layer1,
      layer2: BACKGROUND.light.layer2,
      layer3: BACKGROUND.light.layer3,
    },

    // Icons
    icon: {
      primary: "hsl(225, 14%, 38%)",
      soft: "hsla(225, 14%, 38%, 0.8)",
    },

    // Tab Bar
    tabBar: {
      primary: BACKGROUND.light.primary,
      icon: {
        focused: "#BE5032",
        unfocused: "hsl(225, 11%, 52%)",
      },
    },

    // Header
    header: "hsl(0, 0%, 100%)",

    // Borders
    border: {
      primary: "rgba(35, 43, 70, 0.09)",
      strong: "rgba(35, 43, 70, 0.17)",
    },

    // Overlay
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  dark: {
    // Accents
    accent: {
      primary: Accent.primary,
      deep: Accent.deep,
      soft: Accent.soft,
      gradient: Accent.gradient,
      success: Accent.success,
      warning: Accent.warning,
      danger: Accent.danger,
    },

    // Text
    text: {
      primary: TEXT.dark.primary,
      header: TEXT.dark.header,
      soft: TEXT.dark.soft,
      muted: TEXT.dark.muted,
      disabled: TEXT.dark.disabled,
      error: Accent.danger,
      onAccent: "#FFFFFF",
    },

    // Backgrounds
    background: {
      primary: BACKGROUND.dark.primary,
      secondary: BACKGROUND.dark.secondary,
      layer1: BACKGROUND.dark.layer1,
      layer2: BACKGROUND.dark.layer2,
      layer3: BACKGROUND.dark.layer3,
    },

    // Icons
    icon: {
      primary: TEXT.dark.primary,
      soft: TEXT.dark.soft,
    },

    // Tab Bar
    tabBar: {
      primary: BACKGROUND.dark.primary,
      icon: {
        focused: Accent.primary,
        unfocused: TEXT.dark.soft,
      },
    },

    // Header
    header: BACKGROUND.dark.primary,

    // Borders
    border: {
      primary: "hsla(220, 35%, 80%, 0.10)",
      strong: "hsla(220, 35%, 100%, 0.15)",
    },

    // Overlay
    overlay: "rgba(0, 0, 0, 0.5)",
  },
};
