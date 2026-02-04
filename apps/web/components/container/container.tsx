"use client";

import React from "react";
import ThemeToggle from "../general/themeToggle";

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative h-full px-5 pb-5 md:px-20">
      {children}
      <ThemeToggle />
    </div>
  );
};
export default Container;
