import type { CSSProperties } from "react";
import type { HabitWithStreak } from "@/src/lib/types";

const TOGGLE_DOTS = Array.from({ length: 16 }, (_, index) => index);

type Props = {
  habit: HabitWithStreak;
  onToggle: (habitId: number) => Promise<void>;
  onEdit: (habit: HabitWithStreak) => void;
};

export function TodayHabitRow({ habit, onToggle, onEdit }: Props) {
  return (
    <article className="habit-row" data-complete={habit.completedToday}>
      <button
        aria-label={habit.completedToday ? `Uncheck ${habit.name}` : `Check ${habit.name}`}
        className="pixel-toggle"
        data-complete={habit.completedToday}
        type="button"
        onClick={() => void onToggle(habit.id)}
      >
        <span aria-hidden="true" className="pixel-toggle__grid">
          {TOGGLE_DOTS.map((dot) => (
            <span
              key={dot}
              className="pixel-toggle__cell"
              style={{ "--index": dot } as CSSProperties}
            />
          ))}
        </span>
      </button>

      <div className="habit-row__content">
        <button
          className="row-main-button"
          type="button"
          onClick={() => void onToggle(habit.id)}
        >
          <p className="habit-row__name" data-complete={habit.completedToday}>
            {habit.name.toUpperCase()}
          </p>
        </button>

        <div className="habit-row__actions">
          {habit.streak > 0 && !habit.completedToday ? <span className="badge">{habit.streak}</span> : null}
          <button className="row-action-button" type="button" onClick={() => onEdit(habit)}>
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}
