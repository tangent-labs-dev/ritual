import Dexie, { type EntityTable } from "dexie";
import type { Completion, Habit } from "@/src/lib/types";

class RitualDatabase extends Dexie {
  habits!: EntityTable<Habit, "id">;
  completions!: EntityTable<Completion, "id">;

  constructor() {
    super("ritual");

    this.version(1).stores({
      habits: "++id, sortOrder, createdAt",
      completions: "++id, habitId, completedDate, [habitId+completedDate]",
    });
  }
}

export const db = new RitualDatabase();
