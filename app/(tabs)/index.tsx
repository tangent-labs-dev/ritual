import React, { useState, useCallback } from "react";
import { FONT } from "@/constants/fonts";
import { View, FlatList, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { useTodayHabits } from "@/hooks/use-completions";
import { useHabits } from "@/hooks/use-habits";
import { useFocusEffect } from "@react-navigation/native";
import { DateHeader } from "@/components/today/DateHeader";
import { DailyQuote } from "@/components/today/DailyQuote";
import { ProgressBar } from "@/components/today/ProgressBar";
import { HabitRow } from "@/components/today/HabitRow";
import { HabitModal } from "@/components/habits/HabitModal";
import type { HabitWithStreak, ScheduleType, DayOfWeek } from "@/db/types";

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
        shadowColor: "#FFFFFF",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 0,
        elevation: 4,
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

function EmptyState() {
  const COLS = 8;
  const ROWS = 6;
  const CELL = 6;
  const GAP = 8;

  return (
    <View style={{ alignItems: "center", paddingTop: 32, paddingBottom: 16 }}>
      <View style={{ marginBottom: 24, opacity: 0.15 }}>
        {Array.from({ length: ROWS }, (_, r) => (
          <View
            key={r}
            style={{ flexDirection: "row", gap: GAP, marginBottom: GAP }}
          >
            {Array.from({ length: COLS }, (_, c) => (
              <View
                key={c}
                style={{
                  width: CELL,
                  height: CELL,
                  backgroundColor: "#FFFFFF",
                }}
              />
            ))}
          </View>
        ))}
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#1E1E1E",
          paddingHorizontal: 24,
          paddingVertical: 16,
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -1,
            left: -1,
            width: 6,
            height: 1,
            backgroundColor: "#FFFFFF",
          }}
        />
        <View
          style={{
            position: "absolute",
            top: -1,
            left: -1,
            width: 1,
            height: 6,
            backgroundColor: "#FFFFFF",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: 6,
            height: 1,
            backgroundColor: "#FFFFFF",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: 1,
            height: 6,
            backgroundColor: "#FFFFFF",
          }}
        />

        <Text
          style={{
            fontFamily: FONT.mono.bold,
            fontSize: 11,
            color: "#FFFFFF",
            letterSpacing: 4,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          NO HABITS YET
        </Text>

        <View
          style={{ height: 1, backgroundColor: "#1E1E1E", marginBottom: 8 }}
        />

        <Text
          style={{
            fontFamily: FONT.mono.regular,
            fontSize: 9,
            color: "#333333",
            letterSpacing: 3,
            textAlign: "center",
          }}
        >
          PRESS + TO BEGIN
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginTop: 20,
          opacity: 0.25,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              width: 2,
              height: 2,
              backgroundColor: "#FFFFFF",
              opacity: 1 - i * 0.15,
            }}
          />
        ))}
        <View
          style={{
            width: 0,
            height: 0,
            borderTopWidth: 4,
            borderTopColor: "transparent",
            borderBottomWidth: 4,
            borderBottomColor: "transparent",
            borderLeftWidth: 6,
            borderLeftColor: "#FFFFFF",
          }}
        />
      </View>
    </View>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        marginTop: 4,
      }}
    >
      <View style={{ width: 3, height: 10, backgroundColor: "#FFFFFF" }} />
      <Text
        style={{
          fontFamily: FONT.mono.bold,
          fontSize: 9,
          color: "#444444",
          letterSpacing: 4,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: "#FFFFFF",
          opacity: 0.06,
        }}
      />
    </View>
  );
}

function LoadingState() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        gap: 12,
      }}
    >
      {Array.from({ length: 3 }, (_, r) => (
        <View key={r} style={{ flexDirection: "row", gap: 8 }}>
          {Array.from({ length: 3 }, (_, c) => {
            const filled = (r + c) % 2 === 0;
            return (
              <View
                key={c}
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: filled ? "#FFFFFF" : "transparent",
                  borderWidth: 1,
                  borderColor: filled ? "#FFFFFF" : "#2A2A2A",
                }}
              />
            );
          })}
        </View>
      ))}
      <Text
        style={{
          fontFamily: FONT.mono.bold,
          fontSize: 9,
          color: "#333333",
          letterSpacing: 4,
          marginTop: 8,
        }}
      >
        LOADING
      </Text>
    </View>
  );
}

export default function TodayScreen() {
  const { spacing } = useTheme();
  const { habits, loading, toggle, refresh } = useTodayHabits();
  const { addHabit, editHabit } = useHabits();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithStreak | null>(
    null,
  );

  const completed = habits.filter((h) => h.completedToday).length;

  const handleEdit = useCallback((habit: HabitWithStreak) => {
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
    await refresh();
  };

  if (loading) return <LoadingState />;

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <FlatList
        data={habits}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingTop: insets.top + spacing[4],
          paddingBottom: insets.bottom + 96,
          paddingHorizontal: spacing[4],
        }}
        ListHeaderComponent={
          <>
            <DateHeader />
            <DailyQuote />
            <ProgressBar completed={completed} total={habits.length} />
            {habits.length > 0 && <SectionDivider label="HABITS" />}
          </>
        }
        renderItem={({ item }: { item: HabitWithStreak }) => (
          <HabitRow habit={item} onToggle={toggle} onEdit={handleEdit} />
        )}
        ListEmptyComponent={<EmptyState />}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#0D0D0D" }} />
        )}
      />

      <View
        style={{
          position: "absolute",
          bottom: Math.max(insets.bottom, 16) + spacing[6],
          right: spacing[4],
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
    </View>
  );
}
