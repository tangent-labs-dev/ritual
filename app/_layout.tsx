import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { db } from "@/db/index";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { useFonts } from "@expo-google-fonts/geist-mono/useFonts";
import { GeistMono_400Regular } from "@expo-google-fonts/geist-mono/400Regular";
import { GeistMono_500Medium } from "@expo-google-fonts/geist-mono/500Medium";
import { GeistMono_600SemiBold } from "@expo-google-fonts/geist-mono/600SemiBold";
import { GeistMono_700Bold } from "@expo-google-fonts/geist-mono/700Bold";
import { GeistMono_800ExtraBold } from "@expo-google-fonts/geist-mono/800ExtraBold";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    GeistMono_400Regular,
    GeistMono_500Medium,
    GeistMono_600SemiBold,
    GeistMono_700Bold,
    GeistMono_800ExtraBold,
  });

  const { success, error } = useMigrations(db, migrations);

  if (!fontsLoaded) return null;

  if (error) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
          }}
        >
          <Text
            style={{ color: "#FFFFFF", fontFamily: "GeistMono_400Regular" }}
          >
            DB migration failed: {error.message}
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!success) return null;

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
