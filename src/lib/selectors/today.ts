import { formatDateKey, todayString } from "@/src/lib/date";
import { getAllCompletions, getCompletionsForDate } from "@/src/lib/repositories/completions";
import { getAllHabits } from "@/src/lib/repositories/habits";
import type { HabitWithStreak } from "@/src/lib/types";

function getCurrentStreak(completedDates: Set<string>) {
  let streak = 0;
  const cursor = new Date();

  while (true) {
    if (!completedDates.has(formatDateKey(cursor))) {
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function getTodayHabits(): Promise<HabitWithStreak[]> {
  const today = todayString();
  const [habits, completionsToday, allCompletions] = await Promise.all([
    getAllHabits(),
    getCompletionsForDate(today),
    getAllCompletions(),
  ]);

  const completedToday = new Set(completionsToday.map((completion) => completion.habitId));
  const completionMap = new Map<number, Set<string>>();

  for (const completion of allCompletions) {
    if (!completionMap.has(completion.habitId)) {
      completionMap.set(completion.habitId, new Set<string>());
    }

    completionMap.get(completion.habitId)?.add(completion.completedDate);
  }

  return habits.map((habit) => ({
    ...habit,
    completedToday: completedToday.has(habit.id),
    streak: getCurrentStreak(completionMap.get(habit.id) ?? new Set<string>()),
  }));
}
