// App.js
import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "./src/theme";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((v) => !v);

  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      <AppNavigator onToggleTheme={toggleTheme} isDark={isDark} />
    </PaperProvider>
  );
}
