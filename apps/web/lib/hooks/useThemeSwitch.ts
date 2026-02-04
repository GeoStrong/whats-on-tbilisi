import { useTheme } from "next-themes";

const useThemeSwitch = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const onThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const setThemeValue = (value: "system" | "light" | "dark") => {
    setTheme(value);
  };

  // Get the resolved theme (actual theme being used, accounting for system preference)
  const currentTheme = resolvedTheme || theme || "system";

  return { theme, currentTheme, setTheme: setThemeValue, onThemeToggle };
};
export default useThemeSwitch;
