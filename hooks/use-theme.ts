/**
 * useTheme() — gives any component the correct light/dark token set.
 *
 * Why a hook and not a plain import?
 * The active theme depends on the user's system setting, which can change
 * at runtime. A hook subscribes to that change and re-renders the component
 * automatically. A static import would stay stale.
 *
 * Usage:
 *   const { colors, spacing, typography } = useTheme();
 *   <View style={{ backgroundColor: colors.background.primary, padding: spacing[4] }} />
 */

import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, type Theme } from "@/constants/theme";

export function useTheme(): Theme {
  const scheme = useColorScheme(); // 'light' | 'dark' | null
  return scheme === "dark" ? darkTheme : lightTheme;
}
