import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { decrypt, encrypt } from "@/lib/encryption"
import { refreshTiktokToken } from "@/lib/tiktok-tool"

export const POST = async (request: Request) => {
    try {
        const { post_history_id } = await request.json()
        const postHistory = await prisma.postHistory.findUnique({
            where: {
                id: post_history_id
            },
            include: {
                connection: true
            }
        })

        if (!postHistory) {
            return NextResponse.json({ error: "Post history not found" }, { status: 404 })
        }

        const publishId = postHistory.publish_id
        const connection = postHistory.connection

        if (!publishId || !connection || connection.social_media !== 'tiktok' || !connection.access_token || !connection.refresh_token) {
            return NextResponse.json({ error: "Invalid post history or missing connection data" }, { status: 400 })
        }

        let access_token_ = decrypt(JSON.parse(connection.access_token))
        let expires_in_ = connection.expires_in
        let refresh_expires_in_ = connection.refresh_expires_in
        let refresh_token_ = decrypt(JSON.parse(connection.refresh_token))
        let updated_at_ = connection.updated_at

        // check if the access token expired, if expired, refresh it
        const expired_date = new Date(new Date(connection.updated_at).getTime() + connection.expires_in * 1000);
        if (expired_date < new Date()) {
            const {
                access_token,
                expires_in,
                refresh_expires_in,
                refresh_token,
                updated_at
            } = await refreshTiktokToken(refresh_token_)
            
            access_token_ = access_token
            expires_in_ = expires_in
            refresh_expires_in_ = refresh_expires_in
            refresh_token_ = refresh_token
            updated_at_ = updated_at

            await prisma.connection.update({
                where: {
                    id: connection.id
                },
                data: {
                    access_token: JSON.stringify(encrypt(access_token_)),
                    expires_in: expires_in_,
                    refresh_expires_in: refresh_expires_in_,
                    refresh_token: JSON.stringify(encrypt(refresh_token_)),
                    updated_at: updated_at_
                }
            })
        }

        const response = await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token_}`,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                publish_id: publishId
            })
        });

        const data = await response.json();

        // Update the database with the latest status
        const fetchStatus = data?.data?.status;
        if (fetchStatus) {
            await prisma.postHistory.update({
                where: { id: post_history_id },
                data: { status: fetchStatus }
            });
        }

        return NextResponse.json({ message: "Publish status fetched successfully", data: data }, { status: 200 });
        
    } catch (error) {
        console.error("Error fetching publish status:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}