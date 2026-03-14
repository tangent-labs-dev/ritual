/**
 * theme.ts — Design Token System
 *
 * Single source of truth for every visual decision in the app.
 * Components never use magic numbers — they import tokens from here.
 *
 * Structure:
 *   palette    → raw named colors (private, never used in components)
 *   colors     → semantic tokens: background, text, accent, border, status
 *   typography → font sizes, weights, line heights
 *   spacing    → 8-point grid scale
 *   radii      → border radius scale
 *   shadows    → elevation presets (iOS shadow* / Android elevation)
 */

import { Platform } from "react-native";

// ---------------------------------------------------------------------------
// Palette — raw color values
// Private to this file. Components never import from palette directly.
// ---------------------------------------------------------------------------
const palette = {
  white: "#FFFFFF",
  black: "#000000",
  grey50: "#F9F9F9",
  grey100: "#F2F2F2",
  grey200: "#E5E5E5",
  grey300: "#CCCCCC",
  grey400: "#AAAAAA",
  grey500: "#888888",
  grey600: "#666666",
  grey700: "#444444",
  grey800: "#2A2A2A",
  grey900: "#1A1A1A",
  indigo300: "#A5B4FC",
  indigo400: "#818CF8",
  indigo500: "#6366F1",
  indigo600: "#4F46E5",
  green400: "#4ADE80",
  green500: "#22C55E",
  red400: "#F87171",
  red500: "#EF4444",
} as const;

// ---------------------------------------------------------------------------
// Colors — semantic tokens
// Components reference colors.background.primary, not raw hex values.
// ---------------------------------------------------------------------------
const lightColors = {
  background: {
    primary: palette.white,
    secondary: palette.grey100,
    tertiary: palette.grey200,
  },
  text: {
    primary: palette.grey900,
    secondary: palette.grey600,
    muted: palette.grey400,
    inverse: palette.white,
  },
  accent: {
    primary: palette.indigo500,
    secondary: palette.indigo300,
    muted: "#EEEEFF",
  },
  border: {
    default: palette.grey200,
    strong: palette.grey300,
  },
  status: {
    success: palette.green500,
    error: palette.red500,
  },
  checkbox: {
    checked: palette.indigo500,
    unchecked: palette.grey200,
  },
} as const;

const darkColors = {
  background: {
    primary: palette.grey900,
    secondary: palette.grey800,
    tertiary: palette.grey700,
  },
  text: {
    primary: "#F0F0F0",
    secondary: palette.grey400,
    muted: palette.grey600,
    inverse: palette.grey900,
  },
  accent: {
    primary: palette.indigo400,
    secondary: palette.indigo600,
    muted: "#1E1E3A",
  },
  border: {
    default: palette.grey700,
    strong: palette.grey600,
  },
  status: {
    success: palette.green400,
    error: palette.red400,
  },
  checkbox: {
    checked: palette.indigo400,
    unchecked: palette.grey700,
  },
} as const;

// ---------------------------------------------------------------------------
// Typography
// System fonts — no loading delay, no FOUT (flash of unstyled text).
// Sizes follow a modular scale. Weights are string literals (RN requirement).
// ---------------------------------------------------------------------------
export const typography = {
  fonts: Platform.select({
    ios: { sans: "System" },
    android: { sans: "Roboto" },
    default: { sans: "System" },
  })!,
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    "2xl": 30,
    "3xl": 36,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.75,
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing — 8-point grid
// Every margin, padding, and gap should use one of these values.
// This creates consistent visual rhythm across the whole app.
// ---------------------------------------------------------------------------
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// ---------------------------------------------------------------------------
// Radii — border radius scale
// ---------------------------------------------------------------------------
export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Shadows
// iOS and Android handle elevation differently so we branch with
// Platform.select. Components spread the result: { ...shadows.md }
// ---------------------------------------------------------------------------
export const shadows = {
  none: {},
  sm: Platform.select({
    ios: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;

// ---------------------------------------------------------------------------
// Colors interface
// Describes the shape of a color set without locking to literal hex values.
// This is what allows both lightColors and darkColors to satisfy Theme.
// Without this, TypeScript would infer colors: typeof lightColors and reject
// darkColors because "#1A1A1A" is not assignable to "#FFFFFF".
// ---------------------------------------------------------------------------
export interface Colors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  accent: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    default: string;
    strong: string;
  };
  status: {
    success: string;
    error: string;
  };
  checkbox: {
    checked: string;
    unchecked: string;
  };
}

// ---------------------------------------------------------------------------
// Theme — the full token set returned by useTheme()
// ---------------------------------------------------------------------------
export type Theme = {
  colors: Colors;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
};

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  radii,
  shadows,
};
export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  radii,
  shadows,
};
