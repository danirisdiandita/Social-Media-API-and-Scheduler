import { encrypt } from '@/lib/encryption';
import { auth } from '../../../../../auth';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';


export async function POST(request: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email
        }
    })
    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    let name: string | undefined
    try {
        const body = await request.json()
        name = body.name
    } catch {
        // If no body or invalid JSON, name will be undefined
    }

    const keyIndex = randomBytes(32).toString('hex') // 64 string length 
    const apiKey = randomBytes(64).toString('hex') // 128 string length 
    const encryptedApiKey = encrypt(apiKey)

    const res_ = await prisma.apiKey.create({
        data: {
            user_id: user.id,
            name: name,
            key_index: keyIndex, 
            key: JSON.stringify(encryptedApiKey),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }
    })

    if (!res_) {
        return new Response(JSON.stringify({ error: 'Failed to generate API key' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'API key generated successfully'}), { status: 200 });
}