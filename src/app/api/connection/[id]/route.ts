import { decrypt, encrypt } from '@/lib/encryption';
import { auth } from '../../../../../auth';
import { prisma } from '@/lib/prisma';
import { refreshTiktokToken, revokeTiktokAccess } from '@/lib/tiktok-tool';
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
    const connectionId = parseInt(id)

    if (isNaN(connectionId)) {
        return new Response(JSON.stringify({ error: 'Invalid connection ID' }), { status: 400 });
    }

    try {
        // Check if the connection belongs to the user
        const connection = await prisma.connection.findFirst({
            where: {
                id: connectionId,
                user_id: user.id
            }
        })

        if (!connection) {
            return new Response(JSON.stringify({ error: 'Connection not found' }), { status: 404 });
        }

        let access_token_ = decrypt(JSON.parse(connection.access_token!))
        let expires_in_ = connection.expires_in
        let refresh_expires_in_ = connection.refresh_expires_in
        let refresh_token_ = decrypt(JSON.parse(connection.refresh_token!))
        let updated_at_ = connection.updated_at

        // check if access_token already expired 

        const expires_at = new Date(connection.updated_at.getTime() + connection.expires_in * 1000)
        if (expires_at < new Date()) {
            // implementing refresh_token 
            try {
                const { access_token, expires_in, refresh_expires_in, refresh_token, updated_at } = await refreshTiktokToken(decrypt(JSON.parse(connection.refresh_token!)))
                access_token_ = access_token
                expires_in_ = expires_in
                refresh_expires_in_ = refresh_expires_in
                refresh_token_ = refresh_token
                updated_at_ = updated_at
                await prisma.connection.update({
                    where: {
                        id: connectionId
                    },
                    data: {
                        access_token: JSON.stringify(encrypt(access_token_)),
                        expires_in: expires_in_,
                        refresh_expires_in: refresh_expires_in_,
                        refresh_token: JSON.stringify(encrypt(refresh_token_)),
                        updated_at: updated_at_
                    }
                })
            } catch (error) {
                if (error instanceof Error) {
                    return new Response(error.message, { status: 500 })
                } else {
                    return new Response('Failed to refresh access token', { status: 500 })
                }
            }

        }


        // revoke connection if tiktok 
        try {
            await revokeTiktokAccess(access_token_!)
        } catch (error) {
            if (error instanceof Error) {
                return new Response(error.message, { status: 500 })
            } else {
                return new Response('Failed to revoke access token', { status: 500 })
            }
        }


        try {
            // Delete the connection
            await prisma.connection.delete({
                where: {
                    id: connectionId
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                return new Response(error.message, { status: 500 })
            } else {
                return new Response('Failed to delete connection', { status: 500 })
            }
        }

        return new Response(JSON.stringify({ message: 'Connection deleted successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 })
        } else {
            return new Response('Failed to delete connection', { status: 500 })
        }
    }
}
