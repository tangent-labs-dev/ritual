import { HabitModal } from "@/components/habits/HabitModal";
import { FONT } from "@/constants/fonts";
import { todayString } from "@/db/completions";
import type { DayOfWeek, Habit, ScheduleType } from "@/db/types";
import { useHabitsWithHeatmap } from "@/hooks/use-habits-heatmap";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Heatmap helpers ──────────────────────────────────────────────────────────

function buildHeatmapGrid(weeksCount = 13): string[][] {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const daysToCurrentMonday = (dow - 1 + 7) % 7;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - daysToCurrentMonday);
  const startMonday = new Date(thisMonday);
  startMonday.setDate(thisMonday.getDate() - (weeksCount - 1) * 7);

  return Array.from({ length: weeksCount }, (_, col) =>
    Array.from({ length: 7 }, (_, row) => {
      const d = new Date(startMonday);
      d.setDate(startMonday.getDate() + col * 7 + row);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }),
  );
}

const GAP = 2;
const WEEKS = 24;

const GRID = buildHeatmapGrid(WEEKS);
const TODAY = todayString();

function MiniHeatmap({ completedDates }: { completedDates: Set<string> }) {
  const { width } = useWindowDimensions();

  const cellSize = Math.floor((width - 32 - (WEEKS - 1) * GAP) / WEEKS);

  return (
    <View style={{ flexDirection: "row", gap: GAP, marginTop: 10 }}>
      {GRID.map((week, col) => (
        <View key={col} style={{ gap: GAP }}>
          {week.map((dateStr, row) => {
            const isFuture = dateStr > TODAY;
            const isDone = !isFuture && completedDates.has(dateStr);
            const isToday = dateStr === TODAY;
            return (
              <View
                key={row}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: isFuture
                    ? "transparent"
                    : isDone
                      ? "#FFFFFF"
                      : "#111111",
                  borderWidth: isToday ? 1 : 0,
                  borderColor: "#444444",
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

function formatSchedule(habit: Habit): string {
  if (habit.scheduleType === "daily") return "DAILY";
  return habit.scheduleDays
    .split(",")
    .filter(Boolean)
    .map((d) => d.slice(0, 1).toUpperCase())
    .join(" · ");
}

function DeleteAction({ onDelete }: { onDelete: () => void }) {
  return (
    <Pressable
      onPress={onDelete}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#2A0000" : "#1A0000",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderLeftWidth: 1,
        borderLeftColor: "#3A0000",
      })}
    >
      <Text
        style={{
          fontFamily: FONT.mono.bold,
          fontSize: 9,
          color: "#F87171",
          letterSpacing: 3,
        }}
      >
        DELETE
      </Text>
    </Pressable>
  );
}

function HabitRow({
  habit,
  completedDates,
  onDelete,
  onEdit,
}: {
  habit: Habit;
  completedDates: Set<string>;
  onDelete: (id: number) => void;
  onEdit: (habit: Habit) => void;
}) {
  return (
    <ReanimatedSwipeable
      renderRightActions={() => (
        <DeleteAction onDelete={() => onDelete(habit.id)} />
      )}
      overshootRight={false}
    >
      <Pressable
        onPress={() => onEdit(habit)}
        style={({ pressed }) => ({
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: pressed ? "#0A0A0A" : "#000000",
        })}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: FONT.mono.bold,
              fontSize: 13,
              color: "#FFFFFF",
              letterSpacing: 0.5,
              flex: 1,
              marginRight: 12,
            }}
            numberOfLines={1}
          >
            {habit.name.toUpperCase()}
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#1E1E1E",
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                fontFamily: FONT.mono.regular,
                fontSize: 8,
                color: "#444444",
                letterSpacing: 2,
              }}
            >
              {formatSchedule(habit)}
            </Text>
          </View>
        </View>
        <MiniHeatmap completedDates={completedDates} />
      </Pressable>
    </ReanimatedSwipeable>
  );
}

// ── FAB ──────────────────────────────────────────────────────────────────────

function PixelFAB({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        position: "absolute",
        width: 48,
        height: 48,
        backgroundColor: pressed ? "#CCCCCC" : "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <View
        style={{
          position: "absolute",
          width: 18,
          height: 2,
          backgroundColor: "#000000",
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 2,
          height: 18,
          backgroundColor: "#000000",
        }}
      />
    </Pressable>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const {
    habits,
    completionMap,
    loading,
    addHabit,
    editHabit,
    removeHabit,
    refresh,
  } = useHabitsWithHeatmap();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleEdit = useCallback((habit: Habit) => {
    setEditingHabit(habit);
    setModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setEditingHabit(null);
  }, []);

  const handleSave = async (
    name: string,
    scheduleType: ScheduleType,
    scheduleDays: DayOfWeek[],
  ) => {
    if (editingHabit) {
      await editHabit(editingHabit.id, { name, scheduleType, scheduleDays });
    } else {
      await addHabit(name, scheduleType, scheduleDays);
    }
  };

  if (loading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000000" }}>
      <FlatList
        data={habits}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 96,
        }}
        renderItem={({ item }) => (
          <HabitRow
            habit={item}
            completedDates={completionMap.get(item.id) ?? new Set()}
            onDelete={removeHabit}
            onEdit={handleEdit}
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#0D0D0D" }} />
        )}
        ListEmptyComponent={
          <Text
            style={{
              fontFamily: FONT.mono.regular,
              fontSize: 9,
              color: "#333333",
              letterSpacing: 3,
              textAlign: "center",
              marginTop: 32,
            }}
          >
            NO HABITS YET
          </Text>
        }
      />

      <View
        style={{
          position: "absolute",
          bottom: Math.max(insets.bottom, 16) + 24,
          right: 16,
          width: 52,
          height: 52,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -4,
            left: -4,
            width: 48,
            height: 48,
            borderWidth: 1,
            borderColor: "#1E1E1E",
          }}
        />
        <PixelFAB onPress={() => setModalVisible(true)} />
      </View>

      <HabitModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSave={handleSave}
        habit={editingHabit ?? undefined}
      />
    </GestureHandlerRootView>
  );
}
