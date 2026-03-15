import { FONT } from "@/constants/fonts";
import { useStatsOverview } from "@/hooks/use-stats-overview";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <View
      style={{
        width: "48%",
        borderWidth: 1,
        borderColor: "#141414",
        backgroundColor: "#050505",
        padding: 14,
        gap: 10,
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
          fontSize: 28,
          color: "#FFFFFF",
          letterSpacing: -1,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: FONT.mono.regular,
          fontSize: 9,
          color: "#6B6B6B",
          letterSpacing: 0.5,
          lineHeight: 14,
        }}
      >
        {hint}
      </Text>
    </View>
  );
}

function SevenDayChart({
  dailyCounts,
}: {
  dailyCounts: { label: string; count: number; isToday: boolean }[];
}) {
  const maxCount = Math.max(...dailyCounts.map((day) => day.count), 1);

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#141414",
        backgroundColor: "#050505",
        padding: 16,
      }}
    >
      <Text
        style={{
          fontFamily: FONT.mono.bold,
          fontSize: 10,
          color: "#FFFFFF",
          letterSpacing: 2,
          marginBottom: 6,
        }}
      >
        LAST 7 DAYS
      </Text>
      <Text
        style={{
          fontFamily: FONT.mono.regular,
          fontSize: 9,
          color: "#555555",
          letterSpacing: 0.5,
          marginBottom: 18,
        }}
      >
        Total completions across all habits.
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 8,
          height: 120,
        }}
      >
        {dailyCounts.map((day) => {
          const height = day.count === 0 ? 6 : Math.max((day.count / maxCount) * 72, 14);

          return (
            <View
              key={day.label}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  fontFamily: FONT.mono.regular,
                  fontSize: 9,
                  color: day.isToday ? "#FFFFFF" : "#666666",
                  marginBottom: 8,
                }}
              >
                {day.count}
              </Text>
              <View
                style={{
                  width: "100%",
                  maxWidth: 28,
                  height,
                  borderWidth: 1,
                  borderColor: day.isToday ? "#666666" : "#1E1E1E",
                  backgroundColor: day.count > 0 ? "#FFFFFF" : "#0D0D0D",
                }}
              />
              <Text
                style={{
                  fontFamily: FONT.mono.regular,
                  fontSize: 8,
                  color: day.isToday ? "#FFFFFF" : "#555555",
                  letterSpacing: 1.5,
                  marginTop: 8,
                }}
              >
                {day.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { overview, loading, refresh } = useStatsOverview();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  if (loading || !overview) return null;

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
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontFamily: FONT.mono.regular,
            fontSize: 8,
            color: "#555555",
            letterSpacing: 3,
          }}
        >
          OVERVIEW
        </Text>
        <Text
          style={{
            fontFamily: FONT.mono.bold,
            fontSize: 24,
            color: "#FFFFFF",
            letterSpacing: -1,
          }}
        >
          STATS
        </Text>
        <Text
          style={{
            fontFamily: FONT.mono.regular,
            fontSize: 10,
            color: "#666666",
            lineHeight: 16,
          }}
        >
          A quick snapshot of how your habits are trending.
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          rowGap: 12,
        }}
      >
        <StatCard
          label="HABITS"
          value={String(overview.totalHabits)}
          hint="Total habits currently tracked."
        />
        <StatCard
          label="DONE TODAY"
          value={String(overview.completedToday)}
          hint="Completions logged for today."
        />
        <StatCard
          label="LAST 7 DAYS"
          value={String(overview.last7DaysCompletions)}
          hint="All completions recorded this week."
        />
        <StatCard
          label="BEST STREAK"
          value={String(overview.bestCurrentStreak)}
          hint="Longest active streak right now."
        />
      </View>

      <SevenDayChart dailyCounts={overview.dailyCounts} />

      <View
        style={{
          borderWidth: 1,
          borderColor: "#141414",
          backgroundColor: "#050505",
          padding: 16,
          gap: 10,
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
          MOST CONSISTENT
        </Text>

        {overview.topHabit ? (
          <>
            <Text
              style={{
                fontFamily: FONT.mono.bold,
                fontSize: 18,
                color: "#FFFFFF",
                letterSpacing: 0.5,
              }}
            >
              {overview.topHabit.name.toUpperCase()}
            </Text>
            <Text
              style={{
                fontFamily: FONT.mono.regular,
                fontSize: 10,
                color: "#666666",
                lineHeight: 16,
              }}
            >
              {overview.topHabit.totalCompletions} total completions and a current streak of{" "}
              {overview.topHabit.currentStreak}.
            </Text>
          </>
        ) : (
          <Text
            style={{
              fontFamily: FONT.mono.regular,
              fontSize: 10,
              color: "#666666",
              lineHeight: 16,
            }}
          >
            Complete a habit to start building stats.
          </Text>
        )}
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#141414",
          backgroundColor: "#050505",
          padding: 16,
          gap: 6,
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
          LIFETIME TOTAL
        </Text>
        <Text
          style={{
            fontFamily: FONT.mono.bold,
            fontSize: 20,
            color: "#FFFFFF",
            letterSpacing: -0.5,
          }}
        >
          {overview.totalCompletions}
        </Text>
        <Text
          style={{
            fontFamily: FONT.mono.regular,
            fontSize: 10,
            color: "#666666",
            lineHeight: 16,
          }}
        >
          Every completion you have logged so far.
        </Text>
      </View>
    </ScrollView>
  );
}
