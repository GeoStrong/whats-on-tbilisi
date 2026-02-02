import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import { createError } from "@/lib/utils/errorHandler";

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const { title, date, endDate, time, endTime, recurringDays } =
      await request.json();

    // Validate required fields
    if (!title || !date || !time || !endTime) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert activity into the database (example query, replace with actual DB logic)
    const activity = {
      id: crypto.randomUUID(),
      title,
      date,
      endDate,
      time,
      endTime,
      recurringDays,
    };

    // Simulate database insertion
    console.log("Activity created:", activity);

    return NextResponse.json(
      { message: "Activity created", activity },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: createError.database("Failed to create activity", { error }) },
      { status: 500 },
    );
  }
});
