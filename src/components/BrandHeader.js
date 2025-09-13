// src/components/BrandHeader.js
import React from "react";
import { Appbar, useTheme } from "react-native-paper";

export default function BrandHeader({ title = "ApnaDukan", onToggleTheme, isDark }) {
  const { colors } = useTheme();

  return (
    <Appbar.Header elevated mode="center-aligned" style={{ backgroundColor: colors.surface }}>
      <Appbar.Content title={title} />
      <Appbar.Action
        icon={isDark ? "weather-sunny" : "weather-night"}
        onPress={onToggleTheme}
        accessibilityLabel="Toggle theme"
      />
    </Appbar.Header>
  );
}
