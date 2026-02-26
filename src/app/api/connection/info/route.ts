import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { refreshTiktokToken } from "@/lib/tiktok-tool";




export async function POST(request: Request) {
    const { connectionId } = await request.json();
    const connection = await prisma.connection.findUnique({
        where: {
            id: connectionId
        }
    })

    if (!connection) {
        return Response.json({ error: 'Connection not found' }, { status: 404 });
    }

    const accessTokenExpirationDate = new Date(connection.updated_at.getTime() + connection.expires_in * 1000);


    /**
    curl --location --request POST 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/' \
    --header 'Authorization: Bearer act.example12345Example12345Example' \
    --header 'Content-Type: application/json; charset=UTF-8'
     */


    let accessTokenWillUse = connection?.access_token ? decrypt(JSON.parse(connection.access_token)) : '';

    if (!accessTokenWillUse) {
        return Response.json({ error: 'Access token not found' }, { status: 401 });
    }

    const now = new Date();
    if (now > accessTokenExpirationDate) {

        // try to refresh the token 



        const refreshTokenExpirationDate = new Date(connection.updated_at.getTime() + connection.refresh_expires_in * 1000);

        // do the refresh token request here 

        if (now > refreshTokenExpirationDate) {
            return Response.json({ error: 'Refresh token expired' }, { status: 401 });
        }


        const refreshToken = decrypt(JSON.parse(connection.refresh_token!))
        const refreshedToken = await refreshTiktokToken(refreshToken);

        if (!refreshedToken) {
            return Response.json({ error: 'Failed to refresh token' }, { status: 401 });
        }

        await prisma.connection.update({
            where: {
                id: connectionId
            },
            data: {
                access_token: refreshedToken.access_token,
                refresh_token: refreshedToken.refresh_token,
                expires_in: refreshedToken.expires_in,
                refresh_expires_in: refreshedToken.refresh_expires_in
            }
        });
        accessTokenWillUse = refreshedToken.access_token;
    }

    const response = await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessTokenWillUse}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            fields: ['open_id', 'display_name', 'avatar_url']
        })
    })

    const data = await response.json();
    return Response.json(data);
}