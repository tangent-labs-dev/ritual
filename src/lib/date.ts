import type { DayOfWeek, StatsDay } from "@/src/lib/types";

export const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
export const MONTH_LABELS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;
export const SCHEDULE_DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

export function todayString() {
  return formatDateKey(new Date());
}

export function buildLastNDays(count: number): StatsDay[] {
  const today = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (count - 1 - index));

    const dateString = formatDateKey(date);
    return {
      date: dateString,
      label: DAY_LABELS[date.getDay()],
      count: 0,
      isToday: dateString === todayString(),
    };
  });
}

export function buildHeatmapGrid(weeksCount = 24): string[][] {
  const today = new Date();
  const dow = today.getDay();
  const daysToCurrentMonday = (dow - 1 + 7) % 7;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - daysToCurrentMonday);
  const startMonday = new Date(thisMonday);
  startMonday.setDate(thisMonday.getDate() - (weeksCount - 1) * 7);

  return Array.from({ length: weeksCount }, (_, column) =>
    Array.from({ length: 7 }, (_, row) => {
      const date = new Date(startMonday);
      date.setDate(startMonday.getDate() + column * 7 + row);
      return formatDateKey(date);
    }),
  );
}
