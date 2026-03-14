import {
  deleteHabit,
  getAllHabits,
  insertHabit,
  updateHabit,
  updateHabitOrder,
} from "@/db/habits";
import { Habit } from "@/db/schema";
import { DayOfWeek, ScheduleType } from "@/db/types";
import { useCallback, useEffect, useState } from "react";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getAllHabits();
    setHabits(data);
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

  const reorderHabits = useCallback(
    async (orderedIds: number[]) => {
      await updateHabitOrder(orderedIds);
      await refresh();
    },
    [refresh],
  );

  return {
    habits,
    loading,
    addHabit,
    editHabit,
    removeHabit,
    reorderHabits,
    refresh,
  };
}
