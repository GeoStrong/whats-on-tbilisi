import React from "react";

const ActivityDetails: React.FC<{
  detail: string;
  value: string | number | React.ReactNode | undefined;
}> = ({ detail, value }) => {
  return (
    <>
      {value && (
        <p className="text-sm text-muted-foreground md:text-base">
          <span className="font-bold text-black dark:text-white">
            {detail}:
          </span>{" "}
          {value}
        </p>
      )}
    </>
  );
};
export default ActivityDetails;
