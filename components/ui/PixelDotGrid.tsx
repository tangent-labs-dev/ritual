import React, { useMemo } from "react";
import { View } from "react-native";

interface Props {
  width: number;
  height: number;
  dotSize?: number;
  gap?: number;
  color?: string;
  opacity?: number;
}

export function PixelDotGrid({
  width,
  height,
  dotSize = 2,
  gap = 10,
  color = "#FFFFFF",
  opacity = 0.12,
}: Props) {
  const dots = useMemo(() => {
    const cols = Math.floor(width / (dotSize + gap));
    const rows = Math.floor(height / (dotSize + gap));
    const items: { key: string; x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({
          key: `${r}-${c}`,
          x: c * (dotSize + gap),
          y: r * (dotSize + gap),
        });
      }
    }
    return items;
  }, [width, height, dotSize, gap]);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        overflow: "hidden",
      }}
      pointerEvents="none"
    >
      {dots.map((dot) => (
        <View
          key={dot.key}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y,
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            opacity,
          }}
        />
      ))}
    </View>
  );
}
