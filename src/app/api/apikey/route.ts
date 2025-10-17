import { decrypt } from '@/lib/encryption';
import { auth } from '../../../../auth';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
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

    // Get pagination params from query string
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = page * limit

    try {
        // Fetch paginated API keys
        let [apiKeys, total] = await Promise.all([
            prisma.apiKey.findMany({
                where: {
                    user_id: user.id
                },
                orderBy: {
                    created_at: 'desc'
                },
                skip,
                take: limit,
            }),
            prisma.apiKey.count({
                where: {
                    user_id: user.id
                }
            })
        ])

        apiKeys = apiKeys.map((el) => {
            el.key = 'autoposting-' + el.key_index + decrypt(JSON.parse(el.key))
            return el
        })

        return new Response(JSON.stringify({
            data: apiKeys,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch API keys' }), { status: 500 });
    }
}
