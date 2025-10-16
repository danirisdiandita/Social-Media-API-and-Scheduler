import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PutObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { Config } from "@/constants/config";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

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
    const apiKey = request.headers.get('Authorization')?.split('Bearer ')[1]
    // const body = await request.json()

    // 64 
    const keyIndex = apiKey?.slice(13, 13 + 64)

    // 128 
    const key = apiKey?.slice(13 + 64, 13 + 64 + 128) || ''

    const apiKeyFromDatabase = await prisma.apiKey.findFirst({
        where: {
            key_index: keyIndex
        }
    })

    if (!apiKeyFromDatabase) {
        return new Response(JSON.stringify({ error: 'Invalid API key' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    let decryptedKey = ''

    try {
        decryptedKey = decrypt(JSON.parse(apiKeyFromDatabase.key))
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid API key' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // decryptedKey cannot be empty string or undefined
    if (decryptedKey === '' || decryptedKey === undefined) {
        return new Response(JSON.stringify({ error: 'Invalid API key' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // decryptedKey needs to be the same with the key
    if (decryptedKey !== key) {
        return new Response(JSON.stringify({ error: 'Invalid API key' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
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
            // Convert file to buffer
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileType = file.type;
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
