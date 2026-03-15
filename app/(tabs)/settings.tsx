import { FONT } from "@/constants/fonts";
import { deleteAllCompletions, getAllCompletions } from "@/db/completions";
import { deleteAllHabits, getAllHabits } from "@/db/habits";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function SectionLabel({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text
        style={{
          fontFamily: FONT.mono.regular,
          fontSize: 8,
          color: "#555555",
          letterSpacing: 3,
        }}
      >
        {eyebrow}
      </Text>
      <Text
        style={{
          fontFamily: FONT.mono.bold,
          fontSize: 24,
          color: "#FFFFFF",
          letterSpacing: -1,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: FONT.mono.regular,
          fontSize: 10,
          color: "#666666",
          lineHeight: 16,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#141414",
        backgroundColor: "#050505",
        padding: 16,
        gap: 12,
      }}
    >
      <Text
        style={{
          fontFamily: FONT.mono.bold,
          fontSize: 10,
          color: "#FFFFFF",
          letterSpacing: 2,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function InfoRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <View style={{ gap: 4 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Text
          style={{
            fontFamily: FONT.mono.regular,
            fontSize: 8,
            color: "#555555",
            letterSpacing: 2.5,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontFamily: FONT.mono.bold,
            fontSize: 11,
            color: "#FFFFFF",
            letterSpacing: 1,
          }}
        >
          {value}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: FONT.mono.regular,
          fontSize: 10,
          color: "#666666",
          lineHeight: 15,
        }}
      >
        {hint}
      </Text>
    </View>
  );
}

function ActionButton({
  label,
  hint,
  tone = "default",
  disabled = false,
  onPress,
}: {
  label: string;
  hint: string;
  tone?: "default" | "danger";
  disabled?: boolean;
  onPress: () => void;
}) {
  const labelColor = disabled
    ? "#444444"
    : tone === "danger"
      ? "#F87171"
      : "#FFFFFF";

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor: tone === "danger" ? "#2A1010" : "#1A1A1A",
        backgroundColor: disabled ? "#040404" : pressed ? "#0D0D0D" : "#080808",
        padding: 14,
        gap: 6,
        opacity: disabled ? 0.6 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: FONT.mono.bold,
          fontSize: 9,
          color: labelColor,
          letterSpacing: 2.5,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: FONT.mono.regular,
          fontSize: 10,
          color: "#666666",
          lineHeight: 15,
        }}
      >
        {hint}
      </Text>
    </Pressable>
  );
}

function LinkRow({
  label,
  value,
  hint,
  onPress,
}: {
  label: string;
  value: string;
  hint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor: "#1A1A1A",
        backgroundColor: pressed ? "#0D0D0D" : "#080808",
        padding: 14,
        gap: 6,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Text
          style={{
            fontFamily: FONT.mono.regular,
            fontSize: 8,
            color: "#555555",
            letterSpacing: 2.5,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontFamily: FONT.mono.bold,
            fontSize: 10,
            color: "#FFFFFF",
            letterSpacing: 0.5,
          }}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: FONT.mono.regular,
          fontSize: 10,
          color: "#666666",
          lineHeight: 15,
        }}
      >
        {hint}
      </Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const [habitCount, setHabitCount] = useState(0);
  const [completionCount, setCompletionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [runningAction, setRunningAction] = useState<
    null | "export" | "clear" | "reset"
  >(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [habits, completions] = await Promise.all([
      getAllHabits(),
      getAllCompletions(),
    ]);
    setHabitCount(habits.length);
    setCompletionCount(completions.length);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleClearHistory = useCallback(() => {
    Alert.alert(
      "Clear completion history?",
      "This removes every logged completion but keeps your habits.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setRunningAction("clear");
            await deleteAllCompletions();
            await refresh();
            setRunningAction(null);
          },
        },
      ],
    );
  }, [refresh]);

  const handleExportData = useCallback(async () => {
    try {
      setRunningAction("export");

      const shareAvailable = await Sharing.isAvailableAsync();
      if (!shareAvailable) {
        Alert.alert(
          "Sharing unavailable",
          "This device cannot open the share sheet right now.",
        );
        return;
      }

      if (!FileSystem.cacheDirectory) {
        Alert.alert(
          "Export unavailable",
          "The app could not access a temporary export folder.",
        );
        return;
      }

      const [habits, completions] = await Promise.all([
        getAllHabits(),
        getAllCompletions(),
      ]);

      const now = new Date();
      const stamp = now.toISOString().replace(/[:.]/g, "-");
      const fileUri = `${FileSystem.cacheDirectory}ritual-backup-${stamp}.json`;
      const payload = {
        app: "ritual",
        version: Constants.expoConfig?.version ?? "DEV",
        exportedAt: now.toISOString(),
        habits,
        completions,
      };

      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(payload, null, 2),
      );

      await Sharing.shareAsync(fileUri, {
        dialogTitle: "Export Ritual data",
        mimeType: "application/json",
        UTI: "public.json",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong during export.";
      Alert.alert("Export failed", message);
    } finally {
      setRunningAction(null);
    }
  }, []);

  const handleResetAllData = useCallback(() => {
    Alert.alert(
      "Reset all app data?",
      "This deletes all habits and all completion history. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setRunningAction("reset");
            await deleteAllCompletions();
            await deleteAllHabits();
            await refresh();
            setRunningAction(null);
          },
        },
      ],
    );
  }, [refresh]);

  const themeLabel =
    scheme === "dark" ? "DARK" : scheme === "light" ? "LIGHT" : "SYSTEM";
  const versionLabel = Constants.expoConfig?.version ?? "DEV";
  const hasData = habitCount > 0 || completionCount > 0;
  const githubUrl = "https://github.com/tangent-labs-dev/ritual";

  const handleOpenGithub = useCallback(async () => {
    try {
      await Linking.openURL(githubUrl);
    } catch {
      Alert.alert("Could not open link", "Please try again in a moment.");
    }
  }, [githubUrl]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#000000",
      }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 32,
        gap: 16,
      }}
    >
      <SectionLabel
        eyebrow="PREFERENCES"
        title="SETTINGS"
        description="A simple home for app info and local data controls."
      />

      <SettingsCard title="APPEARANCE">
        <InfoRow
          label="CURRENT THEME"
          value={themeLabel}
          hint="Ritual currently follows your device appearance automatically."
        />
      </SettingsCard>

      <SettingsCard title="LOCAL DATA">
        <InfoRow
          label="HABITS"
          value={loading ? "..." : String(habitCount)}
          hint="How many habits are stored on this device."
        />
        <View style={{ height: 1, backgroundColor: "#121212" }} />
        <InfoRow
          label="COMPLETIONS"
          value={loading ? "..." : String(completionCount)}
          hint="Total daily check-ins recorded so far."
        />
        <View style={{ height: 1, backgroundColor: "#121212" }} />
        <ActionButton
          label={runningAction === "export" ? "EXPORTING..." : "EXPORT DATA"}
          hint="Create a JSON backup and open the system share sheet."
          disabled={!hasData || runningAction !== null}
          onPress={handleExportData}
        />
        <ActionButton
          label={runningAction === "clear" ? "CLEARING..." : "CLEAR HISTORY"}
          hint="Remove all completion history and keep your habit list."
          disabled={completionCount === 0 || runningAction !== null}
          onPress={handleClearHistory}
        />
        <ActionButton
          label={runningAction === "reset" ? "RESETTING..." : "RESET ALL DATA"}
          hint="Delete every habit and completion from this device."
          tone="danger"
          disabled={!hasData || runningAction !== null}
          onPress={handleResetAllData}
        />
      </SettingsCard>

      <SettingsCard title="ABOUT">
        <InfoRow
          label="VERSION"
          value={versionLabel}
          hint="Latest released version."
        />
        <View style={{ height: 1, backgroundColor: "#121212" }} />
        <InfoRow
          label="STORAGE"
          value="LOCAL"
          hint="Habits and completions are stored locally in SQLite."
        />
        <View style={{ height: 1, backgroundColor: "#121212" }} />
        <LinkRow
          label="GITHUB"
          value="OPEN REPO"
          hint="Tap to open the GitHub repo. If you find a bug, please report it there."
          onPress={handleOpenGithub}
        />
      </SettingsCard>
    </ScrollView>
  );
}
