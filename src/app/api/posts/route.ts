import { Config } from "@/constants/config"
import { decrypt, encrypt } from "@/lib/encryption"
import { prisma } from "@/lib/prisma"
import { refreshTiktokToken } from "@/lib/tiktok-tool"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    const apiKey = request.headers.get('Authorization')?.split('Bearer ')[1]
    // const body = await request.json()

    // 64 
    const keyIndex = apiKey?.slice(13, 13 + 64)

    // 128 
    const key = apiKey?.slice(13 + 64, 13 + 64 + 128) || ''

    const apiKeyFromDatabase = await prisma.apiKey.findFirst({
        where: {
            key_index: keyIndex
        }
    })

    if (!apiKeyFromDatabase) {
        return new Response(JSON.stringify({
            message: "Invalid API key", data: [
                {
                    error: {
                        code: '401',
                        message: 'Invalid API key',
                    }
                }
            ]
        }), {
            status: 403,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    let decryptedKey = ''

    try {
        decryptedKey = decrypt(JSON.parse(apiKeyFromDatabase.key))
    } catch {
        return new Response(JSON.stringify({
            message: "Invalid API key", data: [
                {
                    error: {
                        code: '401',
                        message: 'Invalid API key',
                    }
                }
            ]
        }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // decryptedKey cannot be empty string or undefined
    if (decryptedKey === '' || decryptedKey === undefined) {
        return new Response(JSON.stringify({
            message: "Invalid API key", data: [
                {
                    error: {
                        code: '401',
                        message: 'Invalid API key',
                    }
                }
            ]
        }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // decryptedKey needs to be the same with the key
    if (decryptedKey !== key) {
        return new Response(JSON.stringify({
            message: "Invalid API key", data: [
                {
                    error: {
                        code: '401',
                        message: 'Invalid API key',
                    }
                }
            ]
        }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }


    // START POSTING PROCESS

    const body = await request.json()

    const title = body.title
    const caption = body.caption
    const connections = body.connections // array of connection slugs
    const mediaType = body.media_type
    const mediaIds = body.media_ids
    const privacy = body.privacy ? body.privacy : 'PUBLIC_TO_EVERYONE'

    const post_history_obj = []

    if (mediaType === 'PHOTO') {
        const connections_ = await prisma.connection.findMany({
            where: {
                connection_slug: {
                    in: connections
                }
            }
        })
        if (connections_.length === 0) {
            return new Response(JSON.stringify({
                message: "Connections not found", data: [
                    {
                        error: {
                            code: '404',
                            message: 'Connections not found',
                        }
                    }
                ]
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        const dataOutput = []

        for (const connection of connections_) {
            switch (connection.social_media) {
                case 'tiktok': {
                    let access_token_ = decrypt(JSON.parse(connection.access_token!))
                    let expires_in_ = connection.expires_in
                    let refresh_expires_in_ = connection.refresh_expires_in
                    let refresh_token_ = decrypt(JSON.parse(connection.refresh_token!))
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
                    // for every image key in body, get the image url from s3

                    const imageUrls = await Promise.all(mediaIds.map(async (mediaId: string) => {
                        return `${Config.NEXT_PUBLIC_URL}/api/file/${mediaId}`
                    }))

                    const response = await fetch('https://open.tiktokapis.com/v2/post/publish/content/init/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${access_token_}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            post_info: {
                                title: title,
                                description: caption,
                                disable_comment: false,
                                privacy_level: privacy,
                                auto_add_music: true
                            },
                            source_info: {
                                source: "PULL_FROM_URL",
                                photo_cover_index: 1,
                                photo_images: imageUrls
                            },
                            post_mode: "DIRECT_POST",
                            media_type: "PHOTO"
                        })
                    });

                    const data_ = await response.json();

                    dataOutput.push(data_)

                    if (data_.data.publish_id) {
                        post_history_obj.push({
                            user_id: apiKeyFromDatabase.user_id,
                            connection_id: connection.id,
                            publish_id: data_.data.publish_id,
                            created_at: new Date(),
                            updated_at: new Date(),
                            title: title,
                            caption: caption,
                            media_type: mediaType,
                            privacy: privacy
                        })
                    }
                    // post the image urls with title and captions to tiktok 

                    break;
                }
                case 'instagram': {
                    break;
                }
                case 'twitter': {
                    break;
                }
                case 'x': {
                    break;
                }
                case 'linkedin': {
                    break;
                }
                case 'youtube': {
                    break;
                }
                default: {
                    break;
                }
            }
        }

        if (post_history_obj.length > 0) {
            await prisma.postHistory.createMany({
                data: post_history_obj
            })
        }

        return NextResponse.json({ message: "Post created successfully", data: dataOutput }, { status: 200 });
    } else {
        // this is video 

        const connections_ = await prisma.connection.findMany({
            where: {
                connection_slug: {
                    in: connections
                }
            }
        })
        if (connections_.length === 0) {
            return new Response(JSON.stringify({
                message: "Connections not found", data: [
                    {
                        error: {
                            code: '404',
                            message: 'Connections not found',
                        }
                    }
                ]
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        const dataOutput = []

        for (const connection of connections_) {
            switch (connection.social_media) {
                case 'tiktok': {
                    if (mediaIds.length === 0) {
                        return new Response(JSON.stringify({
                            message: "Media not found", data: [
                                {
                                    error: {
                                        code: 'MEDIA_NOT_FOUND',
                                        message: 'Media not found',
                                    }
                                }
                            ]
                        }), {
                            status: 404,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    }
                    const videoUrl = `${Config.NEXT_PUBLIC_URL}/api/file/${mediaIds[0]}`
                    const response = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${decrypt(JSON.parse(connection.access_token!))}`,
                            'Content-Type': 'application/json; charset=UTF-8'
                        },
                        body: JSON.stringify({
                            post_info: {
                                title: title,
                                privacy_level: privacy,
                                disable_duet: false,
                                disable_comment: false,
                                disable_stitch: false,
                                video_cover_timestamp_ms: 1000
                            },
                            source_info: {
                                source: "PULL_FROM_URL",
                                video_url: videoUrl
                            }
                        })
                    });
                    const data_ = await response.json();
                    dataOutput.push(data_)

                    if (data_.data.publish_id) {
                        post_history_obj.push({
                            user_id: apiKeyFromDatabase.user_id,
                            connection_id: connection.id,
                            publish_id: data_.data.publish_id,
                            created_at: new Date(),
                            updated_at: new Date(),
                            title: title,
                            caption: caption,
                            media_type: mediaType,
                            privacy: privacy
                        })
                    }
                    break;
                }
                case 'instagram': {
                    break;
                }
                case 'twitter': {
                    break;
                }
                case 'x': {
                    break;
                }
                case 'linkedin': {
                    break;
                }
                case 'youtube': {
                    break;
                }
                default: {
                    break;
                }
            }
        }

        if (post_history_obj.length > 0) {
            await prisma.postHistory.createMany({
                data: post_history_obj
            })
        } else {
            return NextResponse.json({
                error: "No post created", data: [{
                    error: {
                        code: '404',
                        message: 'No post created',
                    }
                }]
            }, { status: 404 });
        }

        return NextResponse.json({ message: "Video Post successfully created", data: dataOutput }, { status: 200 });
    }
}