import { buildLastNDays, formatDateKey, todayString } from "@/src/lib/date";
import { getAllCompletions } from "@/src/lib/repositories/completions";
import { getAllHabits } from "@/src/lib/repositories/habits";
import type { Habit, StatsOverview, TopHabitSummary } from "@/src/lib/types";

function getCurrentStreak(completedDates: Set<string>) {
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const dateKey = formatDateKey(cursor);
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
  if (habits.length === 0) {
    return null;
  }

  let topHabit: TopHabitSummary | null = null;

  for (const habit of habits) {
    const completedDates = completionsByHabit.get(habit.id) ?? new Set<string>();
    const summary = {
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

export async function getStatsOverview(): Promise<StatsOverview> {
  const [habits, completions] = await Promise.all([getAllHabits(), getAllCompletions()]);
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

    completionsByHabit.get(completion.habitId)?.add(completion.completedDate);

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
    bestCurrentStreak = Math.max(bestCurrentStreak, getCurrentStreak(completedDates));
  }

  return {
    totalHabits: habits.length,
    completedToday,
    totalCompletions: completions.length,
    last7DaysCompletions,
    bestCurrentStreak,
    dailyCounts,
    topHabit: buildTopHabit(habits, completionsByHabit),
  };
}
