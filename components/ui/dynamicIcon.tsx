import * as Icons from "@mui/icons-material";
import React from "react";

type IconProps = {
  name: string;
  className?: string;
};

const DynamicIcon: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = (
    Icons as Record<string, React.ComponentType<{ className?: string }>>
  )[name];

  if (!IconComponent) {
    console.warn(`MUI icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} />;
};

export default DynamicIcon;
