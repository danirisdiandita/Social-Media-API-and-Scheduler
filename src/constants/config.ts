export const Config = {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV ? process.env.NEXT_PUBLIC_ENV : 'development', 

    // database
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_ADAPTER: process.env.DATABASE_ADAPTER,
    NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',

    // NEXT AUTH
    AUTH_URL: process.env.AUTH_URL, 

    // social media endpoints api 
    TIKTOK_ENDPOINT_URL: process.env.TIKTOK_ENDPOINT_URL,
    TIKTOK_CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY,
    TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET,
    TIKTOK_REDIRECT_URI: process.env.TIKTOK_REDIRECT_URI,

    // discord webhook
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    // encryption
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

    // S3
    S3_URL: process.env.S3_URL,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
}