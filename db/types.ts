import type { Habit } from "./schema";

export type { Habit, NewHabit, Completion, NewCompletion } from "./schema";

export type ScheduleType = "daily" | "custom";

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface HabitWithStreak extends Habit {
  streak: number;
  completedToday: boolean;
}
