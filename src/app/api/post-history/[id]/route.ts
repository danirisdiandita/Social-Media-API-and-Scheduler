import { auth } from '../../../../../auth';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const postHistoryId = parseInt(id)

    if (isNaN(postHistoryId)) {
        return new Response(JSON.stringify({ error: 'Invalid post history ID' }), { status: 400 });
    }

    try {
        // Check if the post history belongs to the user
        const postHistory = await prisma.postHistory.findFirst({
            where: {
                id: postHistoryId,
                user_id: user.id
            }
        })

        if (!postHistory) {
            return new Response(JSON.stringify({ error: 'Post history not found' }), { status: 404 });
        }

        // Delete the post history
        await prisma.postHistory.delete({
            where: {
                id: postHistoryId
            }
        })

        return new Response(JSON.stringify({ message: 'Post history deleted successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } else {
            return new Response(JSON.stringify({ error: 'Failed to delete post history' }), { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }
}
