import { Skeleton } from "@mui/material";
import React from "react";

const HeaderProfileLoader: React.FC = () => {
  return (
    <Skeleton
      className="dark:!bg-slate-700"
      variant="circular"
      width={35}
      height={35}
    />
  );
};
export default HeaderProfileLoader;
