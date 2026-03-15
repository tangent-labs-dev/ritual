"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type Props = {
  completedDates: Set<string>;
  grid: string[][];
  today: string;
};

const CELL_SIZE_REM = 0.625;
const COLUMN_GAP_REM = 0.125;

export function HeatmapGrid({ completedDates, grid, today }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleColumns, setVisibleColumns] = useState(grid.length);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    function updateVisibleColumns(width: number) {
      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const columnWidth = (CELL_SIZE_REM + COLUMN_GAP_REM) * rootFontSize;
      const nextVisibleColumns = Math.max(
        1,
        Math.min(grid.length, Math.floor((width + columnWidth * 0.25) / columnWidth)),
      );

      setVisibleColumns(nextVisibleColumns);
    }

    updateVisibleColumns(element.clientWidth);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      updateVisibleColumns(entry.contentRect.width);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [grid.length]);

  const visibleGrid = useMemo(
    () => grid.slice(Math.max(0, grid.length - visibleColumns)),
    [grid, visibleColumns],
  );

  const gridStyle = {
    "--heatmap-columns": visibleGrid.length,
  } as CSSProperties;

  return (
    <div ref={containerRef} aria-hidden="true" className="heatmap-grid" style={gridStyle}>
      {visibleGrid.map((week, weekIndex) => (
        <div key={weekIndex} className="heatmap-grid__week">
          {week.map((dateString) => {
            const complete = completedDates.has(dateString);
            return (
              <span
                key={dateString}
                className="heatmap-grid__cell"
                data-complete={complete}
                data-future={dateString > today}
                data-today={dateString === today}
                title={dateString}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
