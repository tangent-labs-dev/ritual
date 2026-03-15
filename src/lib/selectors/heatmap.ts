import { buildHeatmapGrid, formatDateKey } from "@/src/lib/date";
import { getAllCompletionsInRange } from "@/src/lib/repositories/completions";
import { getAllHabits } from "@/src/lib/repositories/habits";

export async function getHabitsHeatmap() {
  const habits = await getAllHabits();
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 24 * 7);

  const completions = await getAllCompletionsInRange(formatDateKey(from), formatDateKey(today));
  const completionMap = new Map<number, Set<string>>();

  for (const completion of completions) {
    if (!completionMap.has(completion.habitId)) {
      completionMap.set(completion.habitId, new Set<string>());
    }

    completionMap.get(completion.habitId)?.add(completion.completedDate);
  }

  return {
    habits,
    completionMap,
    grid: buildHeatmapGrid(24),
  };
}
