"use client";

import { useStatsOverview } from "@/src/hooks/useStatsOverview";

export default function StatsPage() {
  const { overview, loading } = useStatsOverview();

  if (loading || !overview) {
    return (
      <div className="page">
        <section className="empty-state">
          <p className="empty-state__title">Loading</p>
          <p className="empty-copy">Crunching your local streak data.</p>
        </section>
      </div>
    );
  }

  const maxCount = Math.max(...overview.dailyCounts.map((day) => day.count), 1);

  return (
    <div className="page">
      <header className="page-intro">
        <span className="section-label">Overview</span>
        <h1 className="page-title">Stats</h1>
        <p className="page-copy">A quick snapshot of how your habits are trending.</p>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-card__label">Habits</span>
          <strong className="stat-card__value">{overview.totalHabits}</strong>
          <p className="card-copy">Total habits currently tracked.</p>
        </article>
        <article className="stat-card">
          <span className="stat-card__label">Done today</span>
          <strong className="stat-card__value">{overview.completedToday}</strong>
          <p className="card-copy">Completions logged for today.</p>
        </article>
        <article className="stat-card">
          <span className="stat-card__label">Last 7 days</span>
          <strong className="stat-card__value">{overview.last7DaysCompletions}</strong>
          <p className="card-copy">All completions recorded this week.</p>
        </article>
        <article className="stat-card">
          <span className="stat-card__label">Best streak</span>
          <strong className="stat-card__value">{overview.bestCurrentStreak}</strong>
          <p className="card-copy">Longest active streak right now.</p>
        </article>
      </section>

      <section className="panel">
        <h2 className="card-title">Last 7 days</h2>
        <p className="card-copy">Total completions across all habits.</p>
        <div className="chart">
          {overview.dailyCounts.map((day) => {
            const height = day.count === 0 ? 6 : Math.max((day.count / maxCount) * 72, 14);

            return (
              <div key={day.date} className="chart__bar-wrap">
                <span className="chart__count">{day.count}</span>
                <div
                  className="chart__bar"
                  data-active={day.isToday}
                  data-filled={day.count > 0}
                  style={{ height }}
                />
                <span className="chart__label">{day.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <h2 className="card-title">Most consistent</h2>
        {overview.topHabit ? (
          <>
            <p className="page-title" style={{ fontSize: "1.25rem" }}>
              {overview.topHabit.name.toUpperCase()}
            </p>
            <p className="card-copy">
              {overview.topHabit.totalCompletions} total completions and a current streak of{" "}
              {overview.topHabit.currentStreak}.
            </p>
          </>
        ) : (
          <p className="card-copy">Complete a habit to start building stats.</p>
        )}
      </section>

      <section className="panel">
        <h2 className="card-title">Lifetime total</h2>
        <p className="page-title" style={{ fontSize: "1.5rem", marginBottom: 0 }}>
          {overview.totalCompletions}
        </p>
        <p className="card-copy">Every completion you have logged so far.</p>
      </section>
    </div>
  );
}
