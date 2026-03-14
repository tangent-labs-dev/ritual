import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { FONT } from "@/constants/fonts";

const DAYS_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function PixelDivider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "#FFFFFF",
        opacity: 0.15,
      }}
    />
  );
}

function DayStrip({ currentDay }: { currentDay: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      {DAYS_SHORT.map((d, i) => {
        const isToday = i === currentDay;
        return (
          <View
            key={d}
            style={{
              paddingHorizontal: 6,
              paddingVertical: 4,
              backgroundColor: isToday ? "#FFFFFF" : "transparent",
              borderWidth: 1,
              borderColor: isToday ? "#FFFFFF" : "#2A2A2A",
            }}
          >
            <Text
              style={{
                fontFamily: FONT.mono.bold,
                fontSize: 9,
                letterSpacing: 1,
                color: isToday ? "#000000" : "#333333",
              }}
            >
              {d}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function PixelDateBlock({
  day,
  month,
  year,
}: {
  day: number;
  month: string;
  year: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 0,
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: "#FFFFFF",
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginRight: 1,
        }}
      >
        <Text
          style={{
            fontFamily: FONT.mono.extraBold,
            fontSize: 48,
            color: "#FFFFFF",
            lineHeight: 52,
            letterSpacing: -2,
          }}
        >
          {String(day).padStart(2, "0")}
        </Text>
      </View>

      <View style={{ flexDirection: "column", gap: 1 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#555555",
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Text
            style={{
              fontFamily: FONT.mono.bold,
              fontSize: 13,
              color: "#000000",
              letterSpacing: 3,
            }}
          >
            {month}
          </Text>
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#2A2A2A",
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontFamily: FONT.mono.regular,
              fontSize: 13,
              color: "#555555",
              letterSpacing: 2,
            }}
          >
            {year}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function DateHeader() {
  const { spacing } = useTheme();

  const now = new Date();
  const dayOfWeek = now.getDay();
  const dayNum = now.getDate();
  const month = MONTHS[now.getMonth()];
  const year = now.getFullYear();

  return (
    <View style={{ marginBottom: spacing[4] }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginBottom: 10,
        }}
      >
        <View style={{ width: 3, height: 10, backgroundColor: "#FFFFFF" }} />
        <Text
          style={{
            fontFamily: FONT.mono.bold,
            fontSize: 10,
            color: "#444444",
            letterSpacing: 4,
          }}
        >
          TODAY
        </Text>
      </View>

      <PixelDateBlock day={dayNum} month={month} year={year} />

      <DayStrip currentDay={dayOfWeek} />

      <PixelDivider />
    </View>
  );
}
