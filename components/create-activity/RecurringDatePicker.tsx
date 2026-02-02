"use client";

import React from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";

interface RecurringDatePickerProps {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
  placeholder?: string;
  className?: string;
}

const RecurringDatePicker: React.FC<RecurringDatePickerProps> = ({
  selectedDates,
  onChange,
  placeholder = "Select Days",
  className = "",
}) => {
  const handleChange = (dates: DateObject[]) => {
    const formattedDates = dates.map(
      (date) => date.toDate().toISOString().split("T")[0],
    );
    onChange(formattedDates);
  };

  return (
    <DatePicker
      multiple
      value={selectedDates.map((date) => new Date(date))}
      onChange={handleChange}
      format="YYYY-MM-DD"
      className={`w-full ${className}`}
      inputClass="border-2 pl-2 rounded-[6px] h-9 w-full dark:border-gray-600"
      placeholder={placeholder}
      mapDays={({ date, today, selectedDate, isSameDate }) => {
        const className = "custom-day";
        let style: React.CSSProperties = {};

        // Style for today
        if (isSameDate(date, today)) {
          style = {
            backgroundColor: "#e0f2fe",
            fontWeight: "bold",
            color: "#0369a1",
          };
        }

        // Style for selected dates
        if (
          Array.isArray(selectedDate) &&
          selectedDate.some((d) => isSameDate(date, d))
        ) {
          style = {
            backgroundColor: "#7c4dff",
            color: "white",
            fontWeight: "bold",
          };
        }

        return { className, style };
      }}
    />
  );
};

export default RecurringDatePicker;
