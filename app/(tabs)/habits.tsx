import { HabitModal } from "@/components/habits/HabitModal";
import { FONT } from "@/constants/fonts";
import type { DayOfWeek, Habit, ScheduleType } from "@/db/types";
import { useHabits } from "@/hooks/use-habits";
import React, { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function formatSchedule(habit: Habit): string {
  if (habit.scheduleType === "daily") return "DAILY";
  return habit.scheduleDays
    .split(",")
    .filter(Boolean)
    .map((d) => d.slice(0, 1).toUpperCase())
    .join(" · ");
}

function ScheduleChip({ habit }: { habit: Habit }) {
  return (
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
  );
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

function HabitManageRow({
  habit,
  onDelete,
  onEdit,
}: {
  habit: Habit;
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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 14,
          paddingHorizontal: 16,
          backgroundColor: pressed ? "#0A0A0A" : "#000000",
        })}
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
        <ScheduleChip habit={habit} />
      </Pressable>
    </ReanimatedSwipeable>
  );
}

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

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const { habits, loading, addHabit, editHabit, removeHabit } = useHabits();

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
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={<SectionDivider label="ALL HABITS" />}
        renderItem={({ item }) => (
          <HabitManageRow
            habit={item}
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
