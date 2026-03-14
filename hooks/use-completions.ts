import {
  getCompletionsForDate,
  getStreak,
  todayString,
  toggleCompletion,
} from "@/db/completions";
import { getAllHabits } from "@/db/habits";
import { HabitWithStreak } from "@/db/types";
import { useCallback, useEffect, useState } from "react";

export function useTodayHabits() {
  const [habits, setHabits] = useState<HabitWithStreak[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const today = todayString();
    const allHabits = await getAllHabits();
    const completedArr = await getCompletionsForDate(today);
    const completedIds = new Set(completedArr.map((c) => c.habitId));

    const enriched: HabitWithStreak[] = await Promise.all(
      allHabits.map(async (habit) => ({
        ...habit,
        completedToday: completedIds.has(habit.id),
        streak: await getStreak(habit.id),
      })),
    );

    setHabits(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (habitId: number) => {
      await toggleCompletion(habitId, todayString());
      await refresh();
    },
    [refresh],
  );

  return { habits, loading, toggle, refresh };
}

export function useStreak(habitId: number) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getStreak(habitId).then(setStreak);
  }, [habitId]);

  return streak;
}
