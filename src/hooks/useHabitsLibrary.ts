"use client";

import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { deleteHabit, insertHabit, updateHabit } from "@/src/lib/repositories/habits";
import { getHabitsHeatmap } from "@/src/lib/selectors/heatmap";
import type { DayOfWeek, ScheduleType } from "@/src/lib/types";

export function useHabitsLibrary() {
  const data = useLiveQuery(() => getHabitsHeatmap(), [], {
    habits: [],
    completionMap: new Map<number, Set<string>>(),
    grid: [],
  });

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

  const removeHabit = useCallback(async (id: number) => {
    await deleteHabit(id);
  }, []);

  return {
    habits: data.habits,
    completionMap: data.completionMap,
    grid: data.grid,
    loading: data === undefined,
    createHabit,
    updateHabit: updateExistingHabit,
    removeHabit,
  };
}
