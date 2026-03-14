import React, { useMemo } from "react";
import { View } from "react-native";

interface Props {
  completed: number;
  total: number;
  cellSize?: number;
  gap?: number;
  maxCols?: number;
}

export function PixelProgressGrid({
  completed,
  total,
  cellSize = 12,
  gap = 3,
  maxCols = 10,
}: Props) {
  const cells = useMemo(() => {
    if (total === 0) return [];
    return Array.from({ length: total }, (_, i) => ({
      key: i,
      filled: i < completed,
    }));
  }, [completed, total]);

  if (total === 0) return null;

  const cols = Math.min(total, maxCols);
  const rows = Math.ceil(total / cols);

  return (
    <View style={{ flexDirection: "column", gap }}>
      {Array.from({ length: rows }, (_, rowIdx) => (
        <View key={rowIdx} style={{ flexDirection: "row", gap }}>
          {Array.from({ length: cols }, (_, colIdx) => {
            const cellIndex = rowIdx * cols + colIdx;
            if (cellIndex >= total) {
              return (
                <View
                  key={colIdx}
                  style={{ width: cellSize, height: cellSize }}
                />
              );
            }
            const cell = cells[cellIndex];
            return (
              <View
                key={colIdx}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell.filled ? "#FFFFFF" : "transparent",
                  borderWidth: 1,
                  borderColor: cell.filled ? "#FFFFFF" : "#333333",
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
