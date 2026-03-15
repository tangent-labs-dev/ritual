"use client";

import { useEffect, useState } from "react";
import { SCHEDULE_DAYS } from "@/src/lib/date";
import type { DayOfWeek, Habit, ScheduleType } from "@/src/lib/types";

type HabitValues = {
  name: string;
  scheduleType: ScheduleType;
  scheduleDays: DayOfWeek[];
};

type Props = {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: HabitValues) => Promise<void>;
};

export function HabitDialog({ habit, isOpen, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [scheduleType, setScheduleType] = useState<ScheduleType>("daily");
  const [scheduleDays, setScheduleDays] = useState<DayOfWeek[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (habit) {
      setName(habit.name);
      setScheduleType(habit.scheduleType);
      setScheduleDays(
        habit.scheduleDays
          ? (habit.scheduleDays.split(",").filter(Boolean) as DayOfWeek[])
          : [],
      );
      return;
    }

    setName("");
    setScheduleType("daily");
    setScheduleDays([]);
  }, [habit, isOpen]);

  if (!isOpen) {
    return null;
  }

  const validName = name.trim().length > 0;
  const validSchedule = scheduleType === "daily" || scheduleDays.length > 0;
  const isValid = validName && validSchedule;

  async function handleSubmit() {
    if (!isValid || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        name: name.trim(),
        scheduleType,
        scheduleDays: scheduleType === "daily" ? [] : scheduleDays,
      });
    } finally {
      setIsSaving(false);
    }
  }

  function toggleDay(day: DayOfWeek) {
    setScheduleDays((current) =>
      current.includes(day)
        ? current.filter((entry) => entry !== day)
        : [...current, day],
    );
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        aria-labelledby="habit-dialog-title"
        aria-modal="true"
        className="dialog-card"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialog-header">
          <h2 className="dialog-title" id="habit-dialog-title">
            {habit ? "Edit habit" : "New habit"}
          </h2>
          <button className="square-button" type="button" onClick={onClose}>
            X
          </button>
        </div>

        <div className="form-grid">
          <label className="field-group">
            <span className="field-label">Habit name</span>
            <input
              autoFocus={!habit}
              className="field-input"
              maxLength={80}
              placeholder="e.g. MORNING RUN, READ, MEDITATE"
              value={name}
              onChange={(event) => setName(event.target.value.toUpperCase())}
            />
          </label>

          <div className="field-group">
            <span className="field-label">Schedule</span>
            <div className="toggle-group">
              <button
                data-active={scheduleType === "daily"}
                type="button"
                onClick={() => setScheduleType("daily")}
              >
                Daily
              </button>
              <button
                data-active={scheduleType === "custom"}
                type="button"
                onClick={() => setScheduleType("custom")}
              >
                Custom
              </button>
            </div>
          </div>

          {scheduleType === "custom" ? (
            <div className="field-group">
              <span className="field-label">Days</span>
              <div className="day-picker">
                {SCHEDULE_DAYS.map((day) => (
                  <button
                    key={day}
                    data-active={scheduleDays.includes(day)}
                    type="button"
                    onClick={() => toggleDay(day)}
                  >
                    {day.slice(0, 1)}
                  </button>
                ))}
              </div>
              {scheduleDays.length === 0 ? (
                <span className="helper-text">Select at least one day</span>
              ) : null}
            </div>
          ) : null}

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" disabled={!isValid || isSaving} type="button" onClick={handleSubmit}>
              {isSaving ? "Saving..." : habit ? "Save changes" : "Add habit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
