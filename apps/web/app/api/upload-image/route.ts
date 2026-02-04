import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2/r2";
import { withAuth } from "@/lib/middleware/auth";
import { errorHandler, createError } from "@/lib/utils/errorHandler";
import { env } from "@/lib/utils/env";

// Valid file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function handleUpload(request: NextRequest) {
  const body = await request.json();
  const { filePath, fileType, fileSize } = body;

  // Validation
  if (!filePath || !fileType) {
    throw createError.validation("Missing filePath or fileType");
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(fileType)) {
    throw createError.validation(
      `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    );
  }

  // Validate file size if provided
  if (fileSize && fileSize > MAX_FILE_SIZE) {
    throw createError.validation(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Validate file path format (prevent directory traversal)
  if (filePath.includes('..') || filePath.startsWith('/')) {
    throw createError.validation("Invalid file path");
  }

  const uploadParams = {
    Bucket: env.r2.bucket,
    Key: filePath,
    ContentType: fileType,
  };

  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand(uploadParams),
    { expiresIn: 60 * 60 * 24 * 7 },
  );

  return NextResponse.json({ signedUrl });
}

export const POST = withAuth(handleUpload);
