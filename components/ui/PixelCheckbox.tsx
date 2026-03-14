import React from "react";
import { View, Pressable } from "react-native";

interface Props {
  checked: boolean;
  onPress?: () => void;
  size?: number;
}

export function PixelCheckbox({ checked, onPress, size = 20 }: Props) {
  const px = Math.max(1, Math.floor(size / 10));

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{
        width: size,
        height: size,
        backgroundColor: checked ? "#FFFFFF" : "#000000",
        borderWidth: px,
        borderColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked && (
        <View style={{ width: size - px * 4, height: size - px * 4 }}>
          {Array.from({ length: size - px * 4 }).map((_, i) => (
            <View
              key={`a-${i}`}
              style={{
                position: "absolute",
                left: i,
                top: i,
                width: px,
                height: px,
                backgroundColor: "#000000",
              }}
            />
          ))}
          {Array.from({ length: size - px * 4 }).map((_, i) => (
            <View
              key={`b-${i}`}
              style={{
                position: "absolute",
                right: i,
                top: i,
                width: px,
                height: px,
                backgroundColor: "#000000",
              }}
            />
          ))}
        </View>
      )}
    </Pressable>
  );
}
