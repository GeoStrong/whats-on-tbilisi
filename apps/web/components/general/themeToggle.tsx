import { MdModeNight } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import React from "react";
import useThemeSwitch from "@/lib/hooks/useThemeSwitch";

const ThemeToggle: React.FC = () => {
  const { currentTheme, onThemeToggle } = useThemeSwitch();

  return (
    <button className="hidden text-3xl md:block" onClick={onThemeToggle}>
      <div className="fixed bottom-1/2 right-3 z-50 hidden items-center justify-center rounded-full border bg-white p-3 shadow-2xl duration-500 hover:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-700 md:flex">
        {currentTheme === "dark" ? (
          <MdLightMode className="text-lg" />
        ) : (
          <MdModeNight className="text-lg" />
        )}
      </div>
    </button>
  );
};
export default ThemeToggle;
