import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/lib/utils/env";

export const r2 = new S3Client({
  region: "auto",
  endpoint: env.r2.endpoint,
  credentials: {
    accessKeyId: env.r2.accessKeyId,
    secretAccessKey: env.r2.secretAccessKey,
  },
});
