import { DAY_LABELS, MONTH_LABELS } from "@/src/lib/date";

export function DateHeader() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");

  return (
    <section className="page">
      <div className="section-label">Today</div>
      <div className="date-block">
        <div className="date-block__day">{day}</div>
        <div className="date-block__meta">
          <div className="date-block__month">{MONTH_LABELS[now.getMonth()]}</div>
          <div className="date-block__year">{now.getFullYear()}</div>
        </div>
      </div>
      <div className="day-strip">
        {DAY_LABELS.map((label, index) => (
          <div key={label} className="day-strip__item" data-active={index === now.getDay()}>
            {label}
          </div>
        ))}
      </div>
      <div className="divider" />
    </section>
  );
}
