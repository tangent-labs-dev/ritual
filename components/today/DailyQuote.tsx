import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { getQuoteForDate } from "@/constants/quotes";
import { FONT } from "@/constants/fonts";

function PixelCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const SIZE = 8;
  const THICKNESS = 2;

  const horizontal: Record<string, object> = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
    br: { bottom: 0, right: 0 },
  };

  const vertical: Record<string, object> = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
    br: { bottom: 0, right: 0 },
  };

  return (
    <View style={{ position: "absolute", ...horizontal[position] }}>
      <View
        style={{
          position: "absolute",
          ...horizontal[position],
          width: SIZE,
          height: THICKNESS,
          backgroundColor: "#FFFFFF",
        }}
      />
      <View
        style={{
          position: "absolute",
          ...vertical[position],
          width: THICKNESS,
          height: SIZE,
          backgroundColor: "#FFFFFF",
        }}
      />
    </View>
  );
}

export function DailyQuote() {
  const { spacing } = useTheme();
  const quote = getQuoteForDate(new Date());

  return (
    <View style={{ marginBottom: spacing[4], position: "relative" }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#1E1E1E",
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          position: "relative",
        }}
      >
        <PixelCorner position="tl" />
        <PixelCorner position="tr" />
        <PixelCorner position="bl" />
        <PixelCorner position="br" />

        <View
          style={{
            position: "absolute",
            top: -8,
            left: 16,
            backgroundColor: "#000000",
            paddingHorizontal: 6,
          }}
        >
          <Text
            style={{
              fontFamily: FONT.mono.bold,
              fontSize: 9,
              color: "#444444",
              letterSpacing: 4,
            }}
          >
            QUOTE
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 3, marginBottom: 8 }}>
          {[0, 1].map((i) => (
            <View key={i} style={{ gap: 2 }}>
              {[0, 1, 2].map((j) => (
                <View
                  key={j}
                  style={{
                    width: 2,
                    height: 2,
                    backgroundColor: j < 2 ? "#444444" : "transparent",
                  }}
                />
              ))}
            </View>
          ))}
        </View>

        <Text
          style={{
            fontFamily: FONT.mono.regular,
            fontSize: 12,
            color: "#CCCCCC",
            lineHeight: 20,
            letterSpacing: 0.2,
          }}
          numberOfLines={3}
        >
          {quote.text}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: spacing[2],
            gap: 6,
          }}
        >
          <View style={{ width: 12, height: 1, backgroundColor: "#444444" }} />
          <Text
            style={{
              fontFamily: FONT.mono.bold,
              fontSize: 10,
              color: "#555555",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {quote.author}
          </Text>
        </View>
      </View>
    </View>
  );
}
