import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const habits = sqliteTable("habits", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  scheduleType: text("schedule_type").notNull().default("daily"),
  scheduleDays: text("schedule_days").notNull().default(""),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(""),
});

export const completions = sqliteTable("completions", {
  id: int().primaryKey({ autoIncrement: true }),
  habitId: int("habit_id")
    .notNull()
    .references(() => habits.id),
  completedDate: text("completed_date").notNull(),
});

export const habitsRelations = relations(habits, ({ many }) => ({
  completions: many(completions),
}));

export const completionsRelations = relations(completions, ({ one }) => ({
  habit: one(habits, {
    fields: [completions.habitId],
    references: [habits.id],
  }),
}));

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type Completion = typeof completions.$inferSelect;
export type NewCompletion = typeof completions.$inferInsert;
