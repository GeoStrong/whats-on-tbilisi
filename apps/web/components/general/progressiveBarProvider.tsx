"use client";

import React from "react";
import { ProgressProvider } from "@bprogress/next/app";

const ProgressiveBarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ProgressProvider
      height="4px"
      color="#7c4dff"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
export default ProgressiveBarProvider;
