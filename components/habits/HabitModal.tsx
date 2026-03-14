import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useTheme } from "@/hooks/use-theme";
import type { ScheduleType, DayOfWeek, HabitWithStreak } from "@/db/types";
import { FONT } from "@/constants/fonts";

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    scheduleType: ScheduleType,
    scheduleDays: DayOfWeek[],
  ) => void;
  habit?: HabitWithStreak;
}

function PixelSectionLabel({ label }: { label: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
      }}
    >
      <View style={{ width: 2, height: 10, backgroundColor: "#FFFFFF" }} />
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
    </View>
  );
}

function PixelDivider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "#1A1A1A",
        marginVertical: 20,
      }}
    />
  );
}

function PixelHandle() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        marginBottom: 20,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            width: 4,
            height: 4,
            backgroundColor: i === 2 ? "#FFFFFF" : "#2A2A2A",
          }}
        />
      ))}
    </View>
  );
}

function PixelToggle({
  options,
  selected,
  onSelect,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#2A2A2A",
        overflow: "hidden",
      }}
    >
      {options.map((opt, i) => {
        const isSelected = opt.value === selected;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isSelected
                ? "#FFFFFF"
                : pressed
                  ? "#0D0D0D"
                  : "#000000",
              borderLeftWidth: i > 0 ? 1 : 0,
              borderLeftColor: "#2A2A2A",
            })}
          >
            <Text
              style={{
                fontFamily: FONT.mono.bold,
                fontSize: 10,
                color: isSelected ? "#000000" : "#444444",
                letterSpacing: 3,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PixelDayPicker({
  selected,
  onToggle,
}: {
  selected: DayOfWeek[];
  onToggle: (day: DayOfWeek) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {DAYS.map((day) => {
        const isSelected = selected.includes(day);
        return (
          <Pressable
            key={day}
            onPress={() => onToggle(day)}
            style={({ pressed }) => ({
              flex: 1,
              aspectRatio: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isSelected
                ? "#FFFFFF"
                : pressed
                  ? "#111111"
                  : "#000000",
              borderWidth: 1,
              borderColor: isSelected ? "#FFFFFF" : "#2A2A2A",
            })}
          >
            <Text
              style={{
                fontFamily: FONT.mono.bold,
                fontSize: 9,
                color: isSelected ? "#000000" : "#444444",
                letterSpacing: 0,
              }}
            >
              {day.slice(0, 1).toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function HabitModal({ visible, onClose, onSave, habit }: Props) {
  const { spacing } = useTheme();

  const [name, setName] = useState("");
  const [scheduleType, setScheduleType] = useState<ScheduleType>("daily");
  const [scheduleDays, setScheduleDays] = useState<DayOfWeek[]>([]);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setScheduleType(habit.scheduleType as ScheduleType);
      setScheduleDays(
        habit.scheduleDays
          ? (habit.scheduleDays.split(",").filter(Boolean) as DayOfWeek[])
          : [],
      );
    } else {
      setName("");
      setScheduleType("daily");
      setScheduleDays([]);
    }
  }, [habit, visible]);

  const toggleDay = useCallback((day: DayOfWeek) => {
    setScheduleDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }, []);

  const handleSave = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed, scheduleType, scheduleType === "daily" ? [] : scheduleDays);
    onClose();
  }, [name, scheduleType, scheduleDays, onSave, onClose]);

  const isValid =
    name.trim().length > 0 &&
    (scheduleType === "daily" || scheduleDays.length > 0);

  const scheduleOptions = [
    { value: "daily", label: "DAILY" },
    { value: "custom", label: "CUSTOM" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.85)" }} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            backgroundColor: "#000000",
            borderTopWidth: 1,
            borderTopColor: "#2A2A2A",
            paddingTop: spacing[4],
            paddingBottom: Platform.OS === "ios" ? spacing[8] : spacing[6],
            paddingHorizontal: spacing[4],
          }}
        >
          <PixelHandle />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: spacing[5],
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginRight: 12,
              }}
            >
              <View
                style={{
                  width: 3,
                  height: 18,
                  backgroundColor: "#FFFFFF",
                  flexShrink: 0,
                }}
              />
              <Text
                style={{
                  fontFamily: FONT.mono.bold,
                  fontSize: 16,
                  color: "#FFFFFF",
                  letterSpacing: 4,
                }}
              >
                {habit ? "EDIT HABIT" : "NEW HABIT"}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => ({
                width: 28,
                height: 28,
                borderWidth: 1,
                borderColor: pressed ? "#FFFFFF" : "#2A2A2A",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <Text
                style={{
                  fontFamily: FONT.mono.bold,
                  fontSize: 12,
                  color: "#555555",
                  lineHeight: 14,
                }}
              >
                X
              </Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <PixelSectionLabel label="HABIT NAME" />
            <View
              style={{
                borderWidth: 1,
                borderColor: "#2A2A2A",
                marginBottom: spacing[5],
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
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. MORNING RUN, READ, MEDITATE"
                placeholderTextColor="#2A2A2A"
                autoFocus={!habit}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                autoCapitalize="characters"
                style={{
                  fontFamily: FONT.mono.bold,
                  fontSize: 13,
                  color: "#FFFFFF",
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[3],
                  letterSpacing: 1,
                }}
              />
            </View>

            <PixelSectionLabel label="SCHEDULE" />
            <View style={{ marginBottom: spacing[4] }}>
              <PixelToggle
                options={scheduleOptions}
                selected={scheduleType}
                onSelect={(v) => setScheduleType(v as ScheduleType)}
              />
            </View>

            {scheduleType === "custom" && (
              <View style={{ marginBottom: spacing[4] }}>
                <PixelSectionLabel label="DAYS" />
                <PixelDayPicker selected={scheduleDays} onToggle={toggleDay} />
                {scheduleDays.length === 0 && (
                  <Text
                    style={{
                      fontFamily: FONT.mono.regular,
                      fontSize: 9,
                      color: "#333333",
                      letterSpacing: 2,
                      marginTop: 8,
                    }}
                  >
                    SELECT AT LEAST ONE DAY
                  </Text>
                )}
              </View>
            )}

            <PixelDivider />

            <Pressable
              onPress={handleSave}
              disabled={!isValid}
              style={({ pressed }) => ({
                borderWidth: 1,
                borderColor: isValid ? "#FFFFFF" : "#1A1A1A",
                paddingVertical: spacing[4],
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isValid
                  ? pressed
                    ? "#CCCCCC"
                    : "#FFFFFF"
                  : "#000000",
                position: "relative",
                overflow: "hidden",
              })}
            >
              {isValid && (
                <>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 8,
                      height: 2,
                      backgroundColor: "#000000",
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 8,
                      height: 2,
                      backgroundColor: "#000000",
                    }}
                  />
                </>
              )}
              <Text
                style={{
                  fontFamily: FONT.mono.bold,
                  fontSize: 12,
                  color: isValid ? "#000000" : "#2A2A2A",
                  letterSpacing: 5,
                }}
              >
                {habit ? "SAVE CHANGES" : "ADD HABIT"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
