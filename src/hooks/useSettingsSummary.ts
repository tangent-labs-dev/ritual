"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getAllCompletions } from "@/src/lib/repositories/completions";
import { getAllHabits } from "@/src/lib/repositories/habits";

export function useSettingsSummary() {
  const summary = useLiveQuery(async () => {
    const [habits, completions] = await Promise.all([getAllHabits(), getAllCompletions()]);
    return {
      habitCount: habits.length,
      completionCount: completions.length,
    };
  }, [], {
    habitCount: 0,
    completionCount: 0,
  });

  return {
    ...summary,
    loading: summary === undefined,
  };
}
