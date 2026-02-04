import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2/r2";
import { withAuth, requireAuthorization } from "@/lib/middleware/auth";
import { createError } from "@/lib/utils/errorHandler";
import { env } from "@/lib/utils/env";

async function handleDelete(request: NextRequest) {
  const body = await request.json();
  const { filePath, userId } = body;

  if (!filePath) {
    throw createError.validation("Missing filePath");
  }

  // Validate file path format
  if (filePath.includes('..') || filePath.startsWith('/')) {
    throw createError.validation("Invalid file path");
  }

  // If userId is provided, verify the user owns the file (filePath should contain userId)
  if (userId) {
    await requireAuthorization(request, userId);
    // Additional check: filePath should contain userId
    if (!filePath.includes(userId)) {
      throw createError.authorization("You can only delete your own files");
    }
  }

  await r2.send(
    new DeleteObjectCommand({
      Bucket: env.r2.bucket,
      Key: filePath,
    }),
  );

  return NextResponse.json({ ok: true });
}

export const POST = withAuth(handleDelete);
