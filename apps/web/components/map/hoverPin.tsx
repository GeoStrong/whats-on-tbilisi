import React, { useState } from "react";
import DynamicIcon from "../ui/dynamicIcon";

interface HoverPinProps {
  id: string;
  categoryColor?: string;
  categoryIcon?: string;
}

const HoverPin: React.FC<HoverPinProps> = ({
  id,
  categoryColor,
  categoryIcon,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      id={id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex h-12 w-12 items-center justify-center"
      style={{
        transform: hover ? "scale(1.25)" : "scale(1)",
        transition: "transform 0.18s ease",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className={`drop-shadow-md fill-${categoryColor}`}
        style={{ width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z" />
      </svg>

      <div className="absolute top-2 z-10">
        {categoryIcon && (
          <DynamicIcon name={categoryIcon} className="!text-lg text-white" />
        )}
      </div>
    </div>
  );
};

export default HoverPin;
