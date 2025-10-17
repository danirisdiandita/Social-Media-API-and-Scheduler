import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Config } from "@/constants/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import crypto from "crypto";

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
    const keyIndex = apiKey?.slice(12, 12 + 64)

    // 128 
    const key = apiKey?.slice(12 + 64, 12 + 64 + 128) || ''

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

    const { fileType } = await request.json()

    if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(fileType)) {
        return new Response(JSON.stringify({ message: 'Invalid file type', data: [{ error: 'Invalid file type' }] }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const extension_: Record<string, string> = { 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' }
    const s3Key = `${crypto.randomUUID()}.${extension_[fileType]}`
    const command = new PutObjectCommand({
        Bucket: Config.S3_BUCKET_NAME!,
        Key: s3Key,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 600 });
    return new Response(JSON.stringify({ message: 'Success', data: { url, media_id: s3Key } }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
