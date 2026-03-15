import { getAllCompletions, todayString } from "@/db/completions";
import { getAllHabits } from "@/db/habits";
import type { Habit } from "@/db/schema";
import { useCallback, useEffect, useState } from "react";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export interface StatsDay {
  date: string;
  label: string;
  count: number;
  isToday: boolean;
}

export interface TopHabitSummary {
  id: number;
  name: string;
  totalCompletions: number;
  currentStreak: number;
}

export interface StatsOverview {
  totalHabits: number;
  completedToday: number;
  totalCompletions: number;
  last7DaysCompletions: number;
  bestCurrentStreak: number;
  dailyCounts: StatsDay[];
  topHabit: TopHabitSummary | null;
}

function formatDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function buildLastNDays(count: number): StatsDay[] {
  const today = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (count - 1 - index));

    const dateString = formatDateString(date);
    return {
      date: dateString,
      label: DAY_LABELS[date.getDay()],
      count: 0,
      isToday: dateString === todayString(),
    };
  });
}

function getCurrentStreak(completedDates: Set<string>): number {
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const dateKey = formatDateString(cursor);
    if (!completedDates.has(dateKey)) {
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function buildTopHabit(
  habits: Habit[],
  completionsByHabit: Map<number, Set<string>>,
): TopHabitSummary | null {
  if (habits.length === 0) return null;

  let topHabit: TopHabitSummary | null = null;

  for (const habit of habits) {
    const completedDates = completionsByHabit.get(habit.id) ?? new Set<string>();
    const summary: TopHabitSummary = {
      id: habit.id,
      name: habit.name,
      totalCompletions: completedDates.size,
      currentStreak: getCurrentStreak(completedDates),
    };

    if (
      !topHabit ||
      summary.totalCompletions > topHabit.totalCompletions ||
      (summary.totalCompletions === topHabit.totalCompletions &&
        summary.currentStreak > topHabit.currentStreak)
    ) {
      topHabit = summary;
    }
  }

  return topHabit;
}

export function useStatsOverview() {
  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [habits, completions] = await Promise.all([
      getAllHabits(),
      getAllCompletions(),
    ]);

    const today = todayString();
    const dailyCounts = buildLastNDays(7);
    const dailyIndex = new Map(dailyCounts.map((day, index) => [day.date, index]));
    const completionsByHabit = new Map<number, Set<string>>();
    let completedToday = 0;
    let last7DaysCompletions = 0;

    for (const completion of completions) {
      if (!completionsByHabit.has(completion.habitId)) {
        completionsByHabit.set(completion.habitId, new Set<string>());
      }

      completionsByHabit.get(completion.habitId)!.add(completion.completedDate);

      if (completion.completedDate === today) {
        completedToday += 1;
      }

      const dayIndex = dailyIndex.get(completion.completedDate);
      if (dayIndex !== undefined) {
        dailyCounts[dayIndex] = {
          ...dailyCounts[dayIndex],
          count: dailyCounts[dayIndex].count + 1,
        };
        last7DaysCompletions += 1;
      }
    }

    let bestCurrentStreak = 0;
    for (const completedDates of completionsByHabit.values()) {
      bestCurrentStreak = Math.max(
        bestCurrentStreak,
        getCurrentStreak(completedDates),
      );
    }

    setOverview({
      totalHabits: habits.length,
      completedToday,
      totalCompletions: completions.length,
      last7DaysCompletions,
      bestCurrentStreak,
      dailyCounts,
      topHabit: buildTopHabit(habits, completionsByHabit),
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { overview, loading, refresh };
}
