import { Config } from "@/constants/config"

export const refreshTiktokToken = async (refresh_token: string) => {
    const updated_at = new Date();
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_key: Config.TIKTOK_CLIENT_KEY!,
            client_secret: Config.TIKTOK_CLIENT_SECRET!,
            grant_type: 'refresh_token',
            refresh_token,
        }),
    })

    const data = await response.json()
    return {
        access_token: data.access_token,
        expires_in: data.expires_in,
        refresh_expires_in: data.refresh_expires_in,
        refresh_token: data.refresh_token,
        updated_at,
    }
}


export const revokeTiktokAccess = async (access_token: string) => {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/revoke/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_key: Config.TIKTOK_CLIENT_KEY!,
            client_secret: Config.TIKTOK_CLIENT_SECRET!,
            token: access_token
        }
        )
    })
    const data = await response.json()
    return data
}