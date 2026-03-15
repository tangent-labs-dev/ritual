export type ScheduleType = "daily" | "custom";

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Habit {
  id: number;
  name: string;
  scheduleType: ScheduleType;
  scheduleDays: string;
  sortOrder: number;
  createdAt: string;
}

export interface Completion {
  id: number;
  habitId: number;
  completedDate: string;
}

export interface HabitWithStreak extends Habit {
  streak: number;
  completedToday: boolean;
}

export interface StatsDay {
  date: string;
  label: string;
  count: number;
  isToday: boolean;
}

export interface TopHabitSummary {
  id: number;
  name: string;
  totalCompletions: number;
  currentStreak: number;
}

export interface StatsOverview {
  totalHabits: number;
  completedToday: number;
  totalCompletions: number;
  last7DaysCompletions: number;
  bestCurrentStreak: number;
  dailyCounts: StatsDay[];
  topHabit: TopHabitSummary | null;
}
