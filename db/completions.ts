import { and, between, desc, eq } from "drizzle-orm";
import { db } from "./index";
import { completions } from "./schema";

export function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function getCompletionsForDate(date: string) {
  return db
    .select()
    .from(completions)
    .where(eq(completions.completedDate, date));
}

export async function getAllCompletions() {
  return db.select().from(completions);
}

export async function deleteAllCompletions() {
  await db.delete(completions);
}

export async function isCompleted(
  habitId: number,
  date: string,
): Promise<boolean> {
  const [row] = await db
    .select()
    .from(completions)
    .where(
      and(
        eq(completions.habitId, habitId),
        eq(completions.completedDate, date),
      ),
    );
  return !!row;
}

export async function toggleCompletion(
  habitId: number,
  date: string,
): Promise<boolean> {
  const already = await isCompleted(habitId, date);

  if (already) {
    await db
      .delete(completions)
      .where(
        and(
          eq(completions.habitId, habitId),
          eq(completions.completedDate, date),
        ),
      );
    return false;
  } else {
    await db.insert(completions).values({ habitId, completedDate: date });
    return true;
  }
}

export async function getStreak(habitId: number): Promise<number> {
  const rows = await db
    .select({ completedDate: completions.completedDate })
    .from(completions)
    .where(eq(completions.habitId, habitId))
    .orderBy(desc(completions.completedDate));

  if (rows.length === 0) return 0;

  const dates = new Set(rows.map((r) => r.completedDate));
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (dates.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export async function getCompletionsInRange(
  habitId: number,
  fromDate: string,
  toDate: string,
) {
  return db
    .select()
    .from(completions)
    .where(
      and(
        eq(completions.habitId, habitId),
        between(completions.completedDate, fromDate, toDate),
      ),
    );
}

export async function getAllCompletionsInRange(
  fromDate: string,
  toDate: string,
) {
  return db
    .select()
    .from(completions)
    .where(between(completions.completedDate, fromDate, toDate));
}
