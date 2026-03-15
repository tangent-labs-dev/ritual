import { getAllCompletionsInRange, todayString } from "@/db/completions";
import {
  deleteHabit,
  getAllHabits,
  insertHabit,
  updateHabit,
} from "@/db/habits";
import type { Habit } from "@/db/schema";
import type { DayOfWeek, ScheduleType } from "@/db/types";
import { useCallback, useEffect, useState } from "react";

export function useHabitsWithHeatmap() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completionMap, setCompletionMap] = useState<Map<number, Set<string>>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const allHabits = await getAllHabits();

    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 24 * 7);
    const fromStr = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`;

    const allCompletions = await getAllCompletionsInRange(
      fromStr,
      todayString(),
    );

    const map = new Map<number, Set<string>>();
    for (const c of allCompletions) {
      if (!map.has(c.habitId)) map.set(c.habitId, new Set());
      map.get(c.habitId)!.add(c.completedDate);
    }

    setHabits(allHabits);
    setCompletionMap(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHabit = useCallback(
    async (
      name: string,
      scheduleType: ScheduleType = "daily",
      scheduleDays: DayOfWeek[] = [],
    ) => {
      await insertHabit(name, scheduleType, scheduleDays);
      await refresh();
    },
    [refresh],
  );

  const editHabit = useCallback(
    async (
      id: number,
      fields: {
        name?: string;
        scheduleType?: ScheduleType;
        scheduleDays?: DayOfWeek[];
      },
    ) => {
      await updateHabit(id, fields);
      await refresh();
    },
    [refresh],
  );

  const removeHabit = useCallback(
    async (id: number) => {
      await deleteHabit(id);
      await refresh();
    },
    [refresh],
  );

  return {
    habits,
    completionMap,
    loading,
    addHabit,
    editHabit,
    removeHabit,
    refresh,
  };
}
