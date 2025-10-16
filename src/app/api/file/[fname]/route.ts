// app/api/download/route.ts
import { NextRequest } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Config } from "@/constants/config";

const s3 = new S3Client({
  region: "auto",
  endpoint: Config.S3_URL as string,
  credentials: {
    accessKeyId: Config.S3_ACCESS_KEY_ID as string,
    secretAccessKey: Config.S3_SECRET_ACCESS_KEY as string,
  },
  forcePathStyle: true, // GCS requires virtual-hosted-style URLs (false)
})



export async function GET(request: NextRequest, { params }: { params: Promise<{ fname: string }> }) {
  const { fname } = await params
  console.log("fname", fname)

  const command = new GetObjectCommand({
    Bucket: Config.S3_BUCKET_NAME as string,
    Key: fname,
  });

  const response = await s3.send(command);
  const file = await response.Body?.transformToByteArray();
  
  if (!file) {
    return new Response("File not found", { status: 404 });
  }
  
  return new Response(Buffer.from(file), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="' + fname + '"',
    },
  });
}
