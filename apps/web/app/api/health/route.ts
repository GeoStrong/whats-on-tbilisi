import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Health check endpoint
 * Returns the health status of the application and its dependencies
 */
export async function GET() {
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "unknown",
      storage: "unknown",
    },
  };

  try {
    // Check database connection
    const supabase = await createServerSupabase();
    const { error } = await supabase.from("users").select("id").limit(1);
    checks.services.database = error ? "unhealthy" : "healthy";
  } catch (error) {
    checks.services.database = "unhealthy";
  }

  // Check storage (R2) - basic check
  try {
    // We can't easily check R2 without credentials, so we'll just check if env vars are set
    const hasR2Config =
      process.env.R2_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY;
    checks.services.storage = hasR2Config ? "healthy" : "unhealthy";
  } catch (error) {
    checks.services.storage = "unhealthy";
  }

  // Overall status
  const allHealthy =
    checks.services.database === "healthy" &&
    checks.services.storage === "healthy";
  checks.status = allHealthy ? "healthy" : "degraded";

  const statusCode = allHealthy ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}

