import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, type Theme } from "@/constants/theme";

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
}
