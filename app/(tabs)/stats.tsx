import { FONT } from "@/constants/fonts";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
        paddingTop: insets.top + 16,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: FONT.mono.bold,
          fontSize: 9,
          color: "#333333",
          letterSpacing: 4,
        }}
      >
        COMING SOON
      </Text>
    </View>
  );
}
