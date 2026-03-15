"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  completed: number;
  total: number;
};

const PROGRESS_CELL_SIZE_REM = 0.75;
const PROGRESS_CELL_GAP_REM = 0.1875;

export function ProgressSummary({ completed, total }: Props) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [availableColumns, setAvailableColumns] = useState(total === 0 ? 1 : total);
  const progress = total === 0 ? 0 : completed / total;
  const filledSegments = Math.round(progress * 20);
  const pct = Math.round(progress * 100);
  const allDone = total > 0 && completed === total;
  const cols = Math.max(1, Math.min(total || 1, availableColumns));
  const rows = total === 0 ? 0 : Math.ceil(total / cols);

  useEffect(() => {
    const element = gridRef.current;

    if (!element) {
      return;
    }

    function updateColumns(width: number) {
      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const columnWidth = (PROGRESS_CELL_SIZE_REM + PROGRESS_CELL_GAP_REM) * rootFontSize;
      const nextColumns = Math.max(
        1,
        Math.min(total || 1, Math.floor((width + PROGRESS_CELL_GAP_REM * rootFontSize) / columnWidth)),
      );

      setAvailableColumns(nextColumns);
    }

    updateColumns(element.clientWidth);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      updateColumns(entry.contentRect.width);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [total]);

  const progressRows = useMemo(
    () =>
      Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => rowIndex * cols + colIndex),
      ),
    [cols, rows],
  );

  return (
    <section className="panel progress-summary">
      <div className="progress-summary__header">
        <span className="section-label">Progress</span>
        <div className="progress-summary__meta">
          <span>
            {completed}/{total}
          </span>
          <span className="progress-pill" data-complete={allDone}>
            {pct}%
          </span>
        </div>
      </div>

      <div className="progress-rail" aria-hidden="true">
        <span>[</span>
        <div className="progress-rail__segments">
          {Array.from({ length: 20 }, (_, index) => (
            <span
              key={index}
              className="progress-rail__segment"
              data-edge={index === filledSegments - 1 && filledSegments > 0}
              data-filled={index < filledSegments}
            />
          ))}
        </div>
        <span>]</span>
      </div>

      {total > 0 && (
        <div ref={gridRef} className="progress-grid" aria-hidden="true">
          {progressRows.map((row, rowIndex) => (
            <div key={rowIndex} className="progress-grid__row">
              {row.map((cellIndex) => {
                if (cellIndex >= total) {
                  return <span key={cellIndex} className="progress-grid__cell" />;
                }

                return (
                  <span
                    key={cellIndex}
                    className="progress-grid__cell"
                    data-filled={cellIndex < completed}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {allDone ? <div className="completion-banner">All done</div> : null}
    </section>
  );
}
