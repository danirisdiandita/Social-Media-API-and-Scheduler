import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/api-key";

export async function GET(request: Request) {
    const user = await getUserFromRequest(request)

    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)
    const skip = (page - 1) * limit
    
    const [connections, totalCount] = await Promise.all([
        prisma.connection.findMany({
            where: {
                user_id: user.id
            },
            skip,
            take: limit
        }),
        prisma.connection.count({
            where: {
                user_id: user.id
            }
        })
    ])
    
    return new Response(JSON.stringify({
        data: connections,
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


