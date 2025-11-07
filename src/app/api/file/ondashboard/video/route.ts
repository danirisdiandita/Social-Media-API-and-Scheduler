import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Config } from "@/constants/config";
import { auth } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

const s3 = new S3Client({
    region: "auto",
    endpoint: Config.S3_URL as string,
    credentials: {
        accessKeyId: Config.S3_ACCESS_KEY_ID as string,
        secretAccessKey: Config.S3_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
})

export async function POST(request: NextRequest) {
    const session = await auth() 
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    if (!session.user?.email) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }

    // check if user exists in database
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email as string
        }
    })
    
    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }
    
    try {
        const body = await request.json();
        const { files } = body; // Array of { name: string, type: string }

        if (!files || !Array.isArray(files) || files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        // Generate presigned URLs for each file
        const presignedUrls: Record<string, { uploadUrl: string; fileName: string }> = {};

        for (const file of files) {
            const fileType = file.type;
            const fileName = `${crypto.randomUUID()}.${fileType.split('/')[1]}`;
            
            const command = new PutObjectCommand({
                Bucket: Config.S3_BUCKET_NAME as string,
                Key: fileName,
                ContentType: fileType,
            });

            try {
                // Generate presigned URL with 1 hour expiration
                const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
                
                // Map original filename to presigned URL and S3 key
                presignedUrls[file.name] = {
                    uploadUrl,
                    fileName
                };
            } catch (error) {
                console.error(`Failed to generate presigned URL for ${file.name}:`, error);
                return NextResponse.json(
                    { error: `Failed to generate upload URL for: ${file.name}` },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json(presignedUrls, { status: 200 });
    } catch (error) {
        let errorMessage = "Failed to generate upload URLs";
        let errorDetails = {};

        if (error instanceof Error) {
            errorMessage = error.message;
            errorDetails = {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        }

        return NextResponse.json(
            {
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
            },
            { status: 500 }
        );
    }
}
