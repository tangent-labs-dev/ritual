import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { PixelProgressGrid } from "@/components/ui/PixelProgressGrid";
import { FONT } from "@/constants/fonts";

interface Props {
  completed: number;
  total: number;
}

function PixelPercentBar({ progress }: { progress: number }) {
  const TOTAL_SEGMENTS = 20;
  const filled = Math.round(progress * TOTAL_SEGMENTS);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Text
        style={{
          fontFamily: FONT.mono.regular,
          fontSize: 11,
          color: "#333333",
          lineHeight: 14,
        }}
      >
        [
      </Text>

      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
        const isFilled = i < filled;
        const isEdge = i === filled - 1;
        return (
          <View
            key={i}
            style={{
              width: 6,
              height: 10,
              backgroundColor: isFilled
                ? isEdge
                  ? "#FFFFFF"
                  : "#CCCCCC"
                : "transparent",
              borderWidth: isFilled ? 0 : 1,
              borderColor: "#1E1E1E",
            }}
          />
        );
      })}

      <Text
        style={{
          fontFamily: FONT.mono.regular,
          fontSize: 11,
          color: "#333333",
          lineHeight: 14,
        }}
      >
        ]
      </Text>
    </View>
  );
}

export function ProgressBar({ completed, total }: Props) {
  const { spacing } = useTheme();

  const progress = total === 0 ? 0 : completed / total;
  const allDone = total > 0 && completed === total;
  const pct = Math.round(progress * 100);

  return (
    <View style={{ marginBottom: spacing[4] }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 3, height: 10, backgroundColor: "#FFFFFF" }} />
          <Text
            style={{
              fontFamily: FONT.mono.bold,
              fontSize: 10,
              color: "#444444",
              letterSpacing: 4,
            }}
          >
            PROGRESS
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text
            style={{
              fontFamily: FONT.mono.regular,
              fontSize: 10,
              color: "#555555",
              letterSpacing: 1,
            }}
          >
            {completed}/{total}
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: allDone ? "#FFFFFF" : "#2A2A2A",
              paddingHorizontal: 6,
              paddingVertical: 2,
              backgroundColor: allDone ? "#FFFFFF" : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: FONT.mono.bold,
                fontSize: 10,
                color: allDone ? "#000000" : "#FFFFFF",
                letterSpacing: 1,
              }}
            >
              {pct}%
            </Text>
          </View>
        </View>
      </View>

      <PixelPercentBar progress={progress} />

      {total > 0 && (
        <View style={{ marginTop: 12 }}>
          <PixelProgressGrid
            completed={completed}
            total={total}
            cellSize={12}
            gap={3}
            maxCols={10}
          />
        </View>
      )}

      {allDone && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginTop: 10,
          }}
        >
          <View style={{ width: 6, height: 6, backgroundColor: "#FFFFFF" }} />
          <Text
            style={{
              fontFamily: FONT.mono.bold,
              fontSize: 10,
              color: "#FFFFFF",
              letterSpacing: 3,
            }}
          >
            ALL DONE
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#FFFFFF",
              opacity: 0.15,
            }}
          />
        </View>
      )}
    </View>
  );
}
