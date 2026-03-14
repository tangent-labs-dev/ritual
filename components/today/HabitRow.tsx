import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { FONT } from "@/constants/fonts";
import type { HabitWithStreak } from "@/db/types";

interface Props {
  habit: HabitWithStreak;
  onToggle: (id: number) => void;
  onEdit?: (habit: HabitWithStreak) => void;
}

function PixelSquareEmpty({ size = 18 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderWidth: 1,
        borderColor: "#2A2A2A",
        backgroundColor: "#000000",
      }}
    />
  );
}

function PixelSquareDone({
  size = 18,
  animate = false,
}: {
  size?: number;
  animate?: boolean;
}) {
  const DOT = 1.5;
  const GAP = 2;
  const STEP = DOT + GAP;
  const PADDING = 2;
  const count = Math.floor((size - PADDING * 2) / STEP);
  const total = count * count;

  const anims = useRef<Animated.Value[]>([]);

  if (anims.current.length !== total) {
    anims.current = Array.from({ length: total }, () => new Animated.Value(0));
  }

  useEffect(() => {
    if (!animate) return;

    anims.current.forEach((a) => a.setValue(0));

    const animations = anims.current.map((a, i) =>
      Animated.sequence([
        Animated.delay(i * 35),
        Animated.timing(a, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.parallel(animations).start();
  }, [animate]);

  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Array.from({ length: count }, (_, row) => (
        <View
          key={row}
          style={{
            flexDirection: "row",
            gap: GAP,
            marginBottom: row < count - 1 ? GAP : 0,
          }}
        >
          {Array.from({ length: count }, (_, col) => {
            const idx = row * count + col;
            const anim = anims.current[idx];
            return (
              <Animated.View
                key={col}
                style={{
                  width: DOT,
                  height: DOT,
                  backgroundColor: "#000000",
                  opacity: animate ? anim : 1,
                  transform: animate
                    ? [
                        {
                          scale: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                        },
                      ]
                    : [],
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

function PixelStreakBadge({ streak }: { streak: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View style={{ width: 7, height: 10, position: "relative" }}>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 7,
            height: 2,
            backgroundColor: "#FFFFFF",
            opacity: 0.9,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 2,
            left: 1,
            width: 5,
            height: 2,
            backgroundColor: "#FFFFFF",
            opacity: 0.7,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 4,
            left: 2,
            width: 3,
            height: 2,
            backgroundColor: "#FFFFFF",
            opacity: 0.5,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 6,
            left: 3,
            width: 1,
            height: 2,
            backgroundColor: "#FFFFFF",
            opacity: 0.3,
          }}
        />
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          paddingHorizontal: 5,
          paddingVertical: 2,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: FONT.mono.bold,
            fontSize: 10,
            color: "#FFFFFF",
            letterSpacing: 1,
          }}
        >
          {streak}
        </Text>
      </View>
    </View>
  );
}

function PixelThreeDots({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => ({
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: pressed ? "#444444" : "#1E1E1E",
        backgroundColor: pressed ? "#0D0D0D" : "transparent",
        marginLeft: 6,
      })}
    >
      <View style={{ gap: 3, alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{ width: 3, height: 3, backgroundColor: "#555555" }}
          />
        ))}
      </View>
    </Pressable>
  );
}

export function HabitRow({ habit, onToggle, onEdit }: Props) {
  const { spacing } = useTheme();

  const handlePress = useCallback(() => {
    onToggle(habit.id);
  }, [habit.id, onToggle]);

  const handleEditPress = useCallback(() => {
    onEdit?.(habit);
  }, [habit, onEdit]);

  const isDone = habit.completedToday;

  const prevDoneRef = useRef(isDone);
  const justDoneRef = useRef(false);

  if (prevDoneRef.current !== isDone) {
    justDoneRef.current = !prevDoneRef.current && isDone;
    prevDoneRef.current = isDone;
  }

  const justDone = justDoneRef.current;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing[3],
        paddingLeft: spacing[3],
        paddingRight: spacing[2],
        backgroundColor: isDone ? "#080808" : "#000000",
        borderWidth: 1,
        borderColor: isDone ? "#1E1E1E" : "#1A1A1A",
        marginBottom: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: isDone ? "#FFFFFF" : "transparent",
        }}
      />

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: pressed ? "#0A0A0A" : "transparent",
          marginLeft: 8,
        })}
      >
        <View style={{ marginRight: spacing[3] }}>
          {isDone ? (
            <PixelSquareDone size={18} animate={justDone} />
          ) : (
            <PixelSquareEmpty size={18} />
          )}
        </View>

        <Text
          style={{
            flex: 1,
            fontFamily: isDone ? FONT.mono.regular : FONT.mono.bold,
            fontSize: 13,
            color: isDone ? "#333333" : "#FFFFFF",
            letterSpacing: 0.5,
            textDecorationLine: isDone ? "line-through" : "none",
          }}
          numberOfLines={1}
        >
          {habit.name.toUpperCase()}
        </Text>
      </Pressable>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {habit.streak > 0 && !isDone && (
          <PixelStreakBadge streak={habit.streak} />
        )}
        <PixelThreeDots onPress={handleEditPress} />
      </View>
    </View>
  );
}
