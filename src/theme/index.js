import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const brand = {
  primary: "#2E7D32",    
  secondary: "#FB8C00",
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brand.primary,
    secondary: brand.secondary,
    background: "#FFFFFF",
    surface: "#F7F7F7",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#81C784",
    secondary: "#FFB74D",
    background: "#121212",
    surface: "#1E1E1E",
  },
};
