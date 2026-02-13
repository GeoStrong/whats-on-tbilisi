import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2/r2";
import { createError, errorHandler } from "@/lib/utils/errorHandler";
import { env } from "@/lib/utils/env";

async function handleGetSignedUrl(request: NextRequest) {
  const body = await request.json();
  const { filePath, expiresIn = 60 * 60 } = body;

  if (!filePath) {
    throw createError.validation("Missing filePath");
  }

  // Validate file path format
  if (filePath.includes("..") || filePath.startsWith("/")) {
    throw createError.validation("Invalid file path");
  }

  // Validate expiresIn is reasonable (max 24 hours)
  const maxExpiresIn = 60 * 60 * 24;
  const validExpiresIn = Math.min(Math.max(expiresIn, 60), maxExpiresIn);

  const command = new GetObjectCommand({
    Bucket: env.r2.bucket,
    Key: filePath,
  });

  const signedUrl = await getSignedUrl(r2, command, {
    expiresIn: validExpiresIn,
  });

  return NextResponse.json({ signedUrl });
}

export const POST = async (request: NextRequest) => {
  try {
    return await handleGetSignedUrl(request);
  } catch (error) {
    const appError = errorHandler.handle(error);
    return NextResponse.json(errorHandler.toApiResponse(appError), {
      status: appError.statusCode,
    });
  }
};
