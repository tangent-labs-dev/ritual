import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 1,
          borderTopColor: "#1A1A1A",
          height: 56,
        },
        tabBarLabelStyle: {
          fontFamily: "GeistMono_700Bold",
          fontSize: 9,
          letterSpacing: 3,
          marginBottom: 6,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#333333",
        tabBarIconStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "TODAY" }} />
      <Tabs.Screen name="habits" options={{ title: "HABITS" }} />
      <Tabs.Screen name="stats" options={{ title: "STATS" }} />
      <Tabs.Screen name="settings" options={{ title: "SETTINGS" }} />
    </Tabs>
  );
}
