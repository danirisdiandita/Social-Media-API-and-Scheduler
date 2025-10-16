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
    const keyId = parseInt(id)
    
    if (isNaN(keyId)) {
        return new Response(JSON.stringify({ error: 'Invalid key ID' }), { status: 400 });
    }

    try {
        // Check if the key belongs to the user
        const apiKey = await prisma.apiKey.findFirst({
            where: {
                id: keyId,
                user_id: user.id
            }
        })

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key not found' }), { status: 404 });
        }

        // Delete the key
        await prisma.apiKey.delete({
            where: {
                id: keyId
            }
        })

        return new Response(JSON.stringify({ message: 'API key deleted successfully' }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete API key' }), { status: 500 });
    }
}
