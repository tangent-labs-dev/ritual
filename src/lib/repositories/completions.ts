import { db } from "@/src/lib/db";
import { getAllHabits } from "@/src/lib/repositories/habits";

export async function getAllCompletions() {
  return db.completions.toArray();
}

export async function getCompletionsForDate(date: string) {
  return db.completions.where("completedDate").equals(date).toArray();
}

export async function getAllCompletionsInRange(fromDate: string, toDate: string) {
  return db.completions.where("completedDate").between(fromDate, toDate, true, true).toArray();
}

export async function deleteAllCompletions() {
  await db.completions.clear();
}

export async function toggleCompletion(habitId: number, date: string) {
  const existing = await db.completions
    .where("[habitId+completedDate]")
    .equals([habitId, date])
    .first();

  if (existing) {
    await db.completions.delete(existing.id);
    return false;
  }

  await db.completions.add({ habitId, completedDate: date });
  return true;
}

export async function exportAllData() {
  const [habits, completions] = await Promise.all([getAllHabits(), getAllCompletions()]);
  return {
    app: "ritual",
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    habits,
    completions,
  };
}

export async function resetAllData() {
  await db.transaction("rw", db.habits, db.completions, async () => {
    await db.completions.clear();
    await db.habits.clear();
  });
}
