import { discordLogger } from "@/lib/discordLogger";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { Config } from "@/constants/config";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { encrypt } from "@/lib/encryption";

export async function GET(request: Request) {
    try {
        const session = await auth();
        const url = new URL(request.url);

        // Get OAuth callback parameters
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const scopes = url.searchParams.get("scopes");

        // Validate required parameters
        if (!code) {
            return new Response("Missing authorization code", { status: 400 });
        }

        // Verify user session
        if (!session?.user?.email) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Get user from database
        const user = await prisma.user.findFirst({
            where: { email: session.user.email }
        });

        if (!user?.id) {
            return new Response("User not found", { status: 404 });
        }

        // Exchange authorization code for access token
        const tokenParams = new URLSearchParams();
        tokenParams.append('client_key', Config.TIKTOK_CLIENT_KEY || '');
        tokenParams.append('client_secret', Config.TIKTOK_CLIENT_SECRET || '');
        tokenParams.append('code', code);
        tokenParams.append('grant_type', 'authorization_code');
        tokenParams.append('redirect_uri', `${Config.AUTH_URL}/api/tiktok-auth/callback`);

        const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            },
            body: tokenParams
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('TikTok OAuth error:', errorData);
            return new Response('Failed to authenticate with TikTok', { status: tokenResponse.status });
        }

        const tokenData = await tokenResponse.json();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${tokenData.access_token}`);

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow' as const
        };

        const userInfoResponse = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name", requestOptions)


        if (!userInfoResponse.ok) {
            const errorData = await userInfoResponse.json();
            console.error('TikTok user info error:', errorData);
            return new Response('Failed to fetch user info from TikTok', { status: userInfoResponse.status });
        }

        const userData = await userInfoResponse.json();
        const existingData = await prisma.connection.findFirst({
            where: {
                open_id: userData.data.user.open_id,
            }
        })
        if (!existingData) {
            const connection_slug = randomBytes(16).toString('hex')
            const connection = await prisma.connection.create({
                data: {
                    code: code,
                    state: state,
                    scopes: scopes,
                    access_token: JSON.stringify(encrypt(tokenData.access_token)),
                    refresh_token: JSON.stringify(encrypt(tokenData.refresh_token)),
                    expires_in: tokenData.expires_in,
                    refresh_expires_in: tokenData.refresh_expires_in,
                    user_id: user.id,
                    display_name: userData.data.user.display_name,
                    avatar_url: userData.data.user.avatar_url,
                    open_id: userData.data.user.open_id,
                    union_id: userData.data.user.union_id,
                    social_media: 'tiktok',
                    connection_slug
                }
            })
        } else {
            if (existingData?.open_id) {
                await prisma.connection.update({
                    where: {
                        open_id: existingData?.open_id!,
                    },
                    data: {
                        code: code,
                        state: state,
                        scopes: scopes,
                        access_token: JSON.stringify(encrypt(tokenData.access_token)),
                        refresh_token: JSON.stringify(encrypt(tokenData.refresh_token)),
                        expires_in: tokenData.expires_in,
                        refresh_expires_in: tokenData.refresh_expires_in,
                        display_name: userData.data.user.display_name,
                        avatar_url: userData.data.user.avatar_url,
                        open_id: userData.data.user.open_id,
                        union_id: userData.data.user.union_id,
                        social_media: 'tiktok'
                    }
                })
            }
        }

        // Store the connection in database

        await discordLogger(`New TikTok connection created for user ${user.id}`);

        // Redirect to connections page
        return NextResponse.redirect(new URL(Config.NEXT_PUBLIC_URL + '/connections', request.url));

    } catch (error) {
        console.error('TikTok OAuth error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}