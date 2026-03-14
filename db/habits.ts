import { eq, max } from "drizzle-orm";
import { db } from "./index";
import { habits } from "./schema";
import type { NewHabit } from "./schema";
import type { ScheduleType, DayOfWeek } from "./types";

export async function getAllHabits() {
  return db.select().from(habits).orderBy(habits.sortOrder, habits.id);
}

export async function insertHabit(
  name: string,
  scheduleType: ScheduleType = "daily",
  scheduleDays: DayOfWeek[] = [],
) {
  const [maxRow] = await db.select({ max: max(habits.sortOrder) }).from(habits);

  const sortOrder = (maxRow?.max ?? -1) + 1;

  const now = new Date();
  const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const newHabit: NewHabit = {
    name,
    scheduleType,
    scheduleDays: scheduleDays.join(","),
    sortOrder,
    createdAt,
  };

  const [inserted] = await db.insert(habits).values(newHabit).returning();
  return inserted;
}

export async function updateHabit(
  id: number,
  fields: {
    name?: string;
    scheduleType?: ScheduleType;
    scheduleDays?: DayOfWeek[];
  },
) {
  await db
    .update(habits)
    .set({
      ...(fields.name && { name: fields.name }),
      ...(fields.scheduleType && { scheduleType: fields.scheduleType }),
      ...(fields.scheduleDays && {
        scheduleDays: fields.scheduleDays.join(","),
      }),
    })
    .where(eq(habits.id, id));
}

export async function deleteHabit(id: number) {
  await db.delete(habits).where(eq(habits.id, id));
}

export async function updateHabitOrder(orderedIds: number[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(habits).set({ sortOrder: index }).where(eq(habits.id, id)),
    ),
  );
}
