"use client";

import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { todayString } from "@/src/lib/date";
import { toggleCompletion } from "@/src/lib/repositories/completions";
import { insertHabit, updateHabit } from "@/src/lib/repositories/habits";
import { getTodayHabits } from "@/src/lib/selectors/today";
import type { DayOfWeek, ScheduleType } from "@/src/lib/types";

export function useTodayHabits() {
  const habits = useLiveQuery(() => getTodayHabits(), [], []);

  const createHabit = useCallback(
    async (values: { name: string; scheduleType: ScheduleType; scheduleDays: DayOfWeek[] }) => {
      await insertHabit(values.name, values.scheduleType, values.scheduleDays);
    },
    [],
  );

  const updateExistingHabit = useCallback(
    async (
      id: number,
      values: { name: string; scheduleType: ScheduleType; scheduleDays: DayOfWeek[] },
    ) => {
      await updateHabit(id, values);
    },
    [],
  );

  const toggleHabit = useCallback(async (habitId: number) => {
    await toggleCompletion(habitId, todayString());
  }, []);

  return {
    habits,
    loading: habits === undefined,
    createHabit,
    updateHabit: updateExistingHabit,
    toggleHabit,
  };
}
