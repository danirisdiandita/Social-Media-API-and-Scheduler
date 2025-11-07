export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PutObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { Config } from "@/constants/config";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { resizeImageFile } from "@/lib/compress-image-buffer";

const s3 = new S3Client({
    region: "auto",
    endpoint: Config.S3_URL as string,
    credentials: {
        accessKeyId: Config.S3_ACCESS_KEY_ID as string,
        secretAccessKey: Config.S3_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true, // GCS requires virtual-hosted-style URLs (false)
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

    // check if user is exists in database
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
        const formData = await request.formData();
        const files: File[] = [];
        
        // Check if useOriginalFilename parameter is set
        const useOriginalFilename = formData.get('useOriginalFilename') === 'true';

        // Collect all files from formData
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                files.push(value);
            }
        }

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        // Object to store the mapping of original filename to S3 key
        const fileMapping: Record<string, string> = {};

        // Upload each file
        for (const file of files) {
            // resize image with max width or height is 1080 px 
            const resizedFile = await resizeImageFile(file);
            // Convert file to buffer
            const bytes = await resizedFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileType = resizedFile.type;
            // Use original filename if parameter is set, otherwise generate UUID-based name
            const fileName = useOriginalFilename 
                ? file.name 
                : `${crypto.randomUUID()}.${fileType.split('/')[1]}`;
            
            const command = new PutObjectCommand({
                Bucket: Config.S3_BUCKET_NAME as string,
                Key: fileName,
                Body: buffer,
                ContentType: fileType,
            });

            try {
                await s3.send(command);
                // Map original filename to S3 key
                fileMapping[file.name] = fileName;
            } catch (error) {
                if (
                    error instanceof S3ServiceException &&
                    error.name === "EntityTooLarge"
                ) {
                    return NextResponse.json(
                        { error: `File too large: ${file.name}` },
                        { status: 400 }
                    );
                } else if (error instanceof S3ServiceException) {
                    return NextResponse.json(
                        { error: `Failed to upload file: ${file.name}` },
                        { status: 500 }
                    );
                } else {
                    throw error;
                }
            }
        }

        return NextResponse.json(fileMapping, { status: 200 });
    } catch (error) {
        let errorMessage = "Failed to upload files";
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
