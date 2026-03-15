import { db } from "@/src/lib/db";
import { todayString } from "@/src/lib/date";
import type { DayOfWeek, Habit, ScheduleType } from "@/src/lib/types";

export async function getAllHabits() {
  return db.habits.orderBy("sortOrder").toArray();
}

export async function insertHabit(
  name: string,
  scheduleType: ScheduleType = "daily",
  scheduleDays: DayOfWeek[] = [],
) {
  const lastHabit = await db.habits.orderBy("sortOrder").last();
  const habit = {
    name,
    scheduleType,
    scheduleDays: scheduleType === "daily" ? "" : scheduleDays.join(","),
    sortOrder: (lastHabit?.sortOrder ?? -1) + 1,
    createdAt: todayString(),
  };

  return db.habits.add(habit as Omit<Habit, "id">);
}

export async function updateHabit(
  id: number,
  fields: {
    name?: string;
    scheduleType?: ScheduleType;
    scheduleDays?: DayOfWeek[];
  },
) {
  const update: Partial<Habit> = {};

  if (fields.name !== undefined) {
    update.name = fields.name;
  }

  if (fields.scheduleType !== undefined) {
    update.scheduleType = fields.scheduleType;
  }

  if (fields.scheduleDays !== undefined) {
    update.scheduleDays = fields.scheduleDays.join(",");
  }

  await db.habits.update(id, update);
}

export async function deleteHabit(id: number) {
  await db.transaction("rw", db.habits, db.completions, async () => {
    await db.completions.where("habitId").equals(id).delete();
    await db.habits.delete(id);
  });
}
