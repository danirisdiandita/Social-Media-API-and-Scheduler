"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Copy, Key, Link2Icon, Terminal } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'
import { Config } from '@/constants/config'

const GettingStartedDocs = () => {
    const postExample = `curl --location '${Config.NEXT_PUBLIC_URL}/api/posts' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer <API KEY>' \\
--data '{
    "title": "My first TikTok post",
    "caption": "This is a caption",
    "connections": [
        "22ed3db73b89658df4d05f62fda58c33"
    ],
    "privacy": "SELF_ONLY",
    "media_type": "PHOTO",
    "media_ids": [
        "6839446e-2b30-45ab-a5e5-865087c3dff2.jpeg",
        "d9d5f572-f72f-40b4-a6ac-6019461ad33f.jpeg",
        "7864e8b1-9d1a-456d-85c8-6bc93e51e537.jpeg",
        "f3533d77-8f82-42b4-b1a8-97c2bb59f02c.jpeg",
        "5835d803-cd29-4efa-a216-e310196dc055.jpeg"
    ]
}'`

    const uploadFileExample = `curl --location "${Config.NEXT_PUBLIC_URL}/api/file" \\
--header 'Authorization: Bearer <API_KEY>' \\
--form 'file=@"/Users/yourname/location/folder/0.jpg"' \\
--form 'file=@"/Users/yourname/location/folder/1.jpg"' \\
--form 'file=@"/Users/yourname/location/folder/3.jpg"' \\
--form 'file=@"/Users/yourname/location/folder/2.jpg"' \\
--form 'file=@"/Users/yourname/location/folder/4.jpg"'
`

    const uploadVideoExample = `curl --location "${Config.NEXT_PUBLIC_URL}/api/file" \\
--header 'Authorization: Bearer <API_KEY>' \\
--form 'file=@"/Users/yourname/location/folder/video.mp4"'
`

    const uploadVideoLargeExample = `curl --location "${Config.NEXT_PUBLIC_URL}/api/file/presigner" \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer <API_KEY>' \\
--data '{
    "fileType": "video/mp4"
}'`

    const uploadVideoToPresignedUrlExample = `curl --location --request PUT '<SIGNED_URL>' \\
--header 'Content-Type: video/mp4' \\
--data-binary '@/Your/Path/To/Video.mp4'`

    const postVideoExample = `curl --location '${Config.NEXT_PUBLIC_URL}/api/posts' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer <API KEY>' \\
--data '{
    "title": "My first TikTok video",
    "caption": "This is a video caption",
    "connections": [
        "22ed3db73b89658df4d05f62fda58c33"
    ],
    "privacy": "SELF_ONLY",
    "media_type": "VIDEO",
    "media_ids": [
        "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6.mp4"
    ]
}'`

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#FFE66D] border-1 border-black flex items-center justify-center">
                            <Key className="w-5 h-5" />
                        </div>
                        1. Get Your API Key
                    </CardTitle>
                    <CardDescription>
                        First, you need to generate an API key to authenticate your requests
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm">Follow these steps to create your first API key:</p>
                        <ul className="space-y-2 ml-4">
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                <span>Navigate to the <Link href="/api-keys" className="underline font-bold hover:text-[#FF6B6B]" target="_blank" rel="noopener noreferrer">API Keys</Link> page</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                <span>Click "Create New Key" button</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                <span>Enter a descriptive name for your key</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                <span>Copy and securely store your API key</span>
                            </li>
                        </ul>
                    </div>
                    <div className="p-4 bg-[#FFE66D] border-1 border-black">
                        <p className="text-sm font-bold">
                            ⚠️ Important: API keys expire after 30 days for security. Make sure to rotate them regularly.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#A0E7E5] border-1 border-black flex items-center justify-center">
                            <Link2Icon className="w-5 h-5" />
                        </div>
                        2. Connect Your Social Account
                    </CardTitle>
                    <CardDescription>
                        Link your social media accounts to start scheduling posts
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm">Follow these steps to connect your social media accounts:</p>
                        <ul className="space-y-2 ml-4">
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                <span>Go to the <Link href="/connections" className="underline font-bold hover:text-[#FF6B6B]" target="_blank" rel="noopener noreferrer">Connections</Link> page</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                <span>Click "Connect Account" button</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                <span>Select your platform (TikTok, Instagram, etc.) (currently only TikTok is supported)</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                Click <span className="font-bold">Connect</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                <span>You will be redirected to the platform&apos;s authorization page, where you will need to authorize AutoPosting to access your account.</span>
                            </li>
                            <li className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                <span>After authorization, you will be redirected back to AutoPosting.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="p-4 bg-[#A0E7E5] border-1 border-black">
                        <p className="text-sm font-bold">
                            💡 Note: You can connect multiple accounts from different platforms to manage all your social media in one place.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='mb-2'>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#FFAAA5] border-1 border-black flex items-center justify-center">
                            <Terminal className="w-5 h-5" />
                        </div>
                        3. Upload Your Files to AutoPosting
                    </CardTitle>
                    <CardDescription>
                        Upload your files to AutoPosting using the API. Choose between photos or video based on your content type. Please for the photo/video restrictions, please refer to  <Link href="https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide" className="underline font-bold hover:text-[#FF6B6B]" target="_blank" rel="noopener noreferrer">TikTok Media Transfer Guide</Link>. Currently AutoPosting only support video less than 50 MB.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="photos" className="w-full">
                        <TabsList>
                            <TabsTrigger value="photos" className="cursor-pointer">
                                Photos
                            </TabsTrigger>
                            <TabsTrigger value="video" className="cursor-pointer">
                                Video ( less than 5 MB)
                            </TabsTrigger>
                            <TabsTrigger value="video-large" className="cursor-pointer">
                                Video ( less than 50 MB)
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="photos" className="mt-4 space-y-4">
                            <div className="relative">
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{uploadFileExample}</code>
                                </pre>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 cursor-pointer bg-[#FFE66D] border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                                    onClick={() => {
                                        navigator.clipboard.writeText(uploadFileExample)
                                        toast.success('Copied!', {
                                            position: 'top-center',
                                        })
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <div>
                                <h4 className="text-sm font-black mb-2">Response:</h4>
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{`{
    "0.jpg": "6839446e-2b30-45ab-a5e5-865087c3dff2.jpeg",
    "1.jpg": "d9d5f572-f72f-40b4-a6ac-6019461ad33f.jpeg",
    "3.jpg": "f3533d77-8f82-42b4-b1a8-97c2bb59f02c.jpeg",
    "2.jpg": "7864e8b1-9d1a-456d-85c8-6bc93e51e537.jpeg",
    "4.jpg": "5835d803-cd29-4efa-a216-e310196dc055.jpeg"
}`}</code>
                                </pre>
                                <p className="text-sm mt-2">
                                    The response returns a mapping of your original filenames to the generated media IDs that you'll use in your post requests. You can upload multiple photos at once (up to 35 for TikTok photo posts).
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="video" className="mt-4 space-y-4">
                            <div className="relative">
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{uploadVideoExample}</code>
                                </pre>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 cursor-pointer bg-[#FFE66D] border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                                    onClick={() => {
                                        navigator.clipboard.writeText(uploadVideoExample)
                                        toast.success('Copied!', {
                                            position: 'top-center',
                                        })
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <div>
                                <h4 className="text-sm font-black mb-2">Response:</h4>
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{`{
    "video.mp4": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6.mp4"
}`}</code>
                                </pre>
                                <p className="text-sm mt-2">
                                    The response returns a mapping of your original filename to the generated media ID. For videos, upload one video file at a time.
                                </p>
                            </div>
                        </TabsContent>
                        <TabsContent value="video-large" className="mt-4 space-y-4">
                            <h4 className="text-sm font-black mb-2">Step 1: Getting the Presigned URL</h4>
                            <p className="text-sm mt-2">
                                Use this endpoint to upload a large video (up to 50MB) to get a presigned URL to upload your file.
                            </p>
                            <h4 className="text-sm font-black mb-2">Request:</h4>
                            <div className="relative ">
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{uploadVideoLargeExample}</code>
                                </pre>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 cursor-pointer bg-[#FFE66D] border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                                    onClick={() => {
                                        navigator.clipboard.writeText(uploadVideoLargeExample)
                                        toast.success('Copied!', {
                                            position: 'top-center',
                                        })
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <div>
                                <h4 className="text-sm font-black mb-2">Response:</h4>
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{`{
    "message": "Success",
    "data": {
        "url": "<SIGNED_URL>",
        "media_id": "<MEDIA_ID>"
    }
}`}</code>
                                </pre>
                                <p className="text-sm mt-2">
                                    The response returns a <span className="font-black">presigned URL</span> and a <span className="font-black">media ID</span>. Use the <span className="font-black">presigned URL</span> to upload your file. Keep the <span className="font-black">media ID</span> for creating your post.
                                </p>
                            </div>
                            <h4 className="text-sm font-bold mb-2">Step 2: File Upload to Presigned URL</h4>
                            <p className="text-sm mt-2">
                                From the previous step, you should have a <span className="font-black">presigned URL</span> and a <span className="font-black">media ID</span>. Use the <span className="font-black">presigned URL</span> to upload your file. Keep the <span className="font-black">media ID</span> for creating your post later.
                            </p>
                            <div className="relative">
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{uploadVideoToPresignedUrlExample}</code>
                                </pre>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 cursor-pointer bg-[#FFE66D] border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                                    onClick={() => {
                                        navigator.clipboard.writeText(uploadVideoToPresignedUrlExample)
                                        toast.success('Copied!', {
                                            position: 'top-center',
                                        })
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div>
                                <h4 className="text-sm font-black mb-2">Response: 200 (empty body)</h4>
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{``}</code>
                                </pre>
                                <p className="text-sm mt-2">
                                    The response returns a <span className="font-black">presigned URL</span> and a <span className="font-black">media ID</span>. Use the <span className="font-black">presigned URL</span> to upload your file. Keep the <span className="font-black">media ID</span> for creating your post.
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#B4F8C8] border-1 border-black flex items-center justify-center">
                            <Terminal className="w-5 h-5" />
                        </div>
                        4. Create Your First Post
                    </CardTitle>
                    <CardDescription>
                        Use the media IDs from step 3 to create a post on TikTok
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="photos" className="w-full">
                        <TabsList>
                            <TabsTrigger value="photos" className="cursor-pointer">
                                Photos
                            </TabsTrigger>
                            <TabsTrigger value="video" className="cursor-pointer">
                                Video
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="photos" className="mt-4 space-y-4">
                            <div className="relative">
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{postExample}</code>
                                </pre>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 cursor-pointer bg-[#FFE66D] border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                                    onClick={() => {
                                        navigator.clipboard.writeText(postExample)
                                        toast.success('Copied!', {
                                            position: 'top-center',
                                        })
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <div>
                                <h4 className="text-sm font-black mb-2">Response:</h4>
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{`{
    "message": "Post created successfully",
    "data": [
        {
            "data": {
                "publish_id": "p_pub_url~v2.7561015427574188088"
            },
            "error": {
                "code": "ok",
                "message": "",
                "log_id": "202510141802024E88FBDF61365E016729"
            }
        }
    ]
}`}</code>
                                </pre>
                                <p className="text-sm mt-2">
                                    The response confirms your photo post was created successfully and includes the publish_id from TikTok.
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="video" className="mt-4 space-y-4">
                            <div className="relative">
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{postVideoExample}</code>
                                </pre>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 cursor-pointer bg-[#FFE66D] border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                                    onClick={() => {
                                        navigator.clipboard.writeText(postVideoExample)
                                        toast.success('Copied!', {
                                            position: 'top-center',
                                        })
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <div>
                                <h4 className="text-sm font-black mb-2">Response:</h4>
                                <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                    <code className="text-sm">{`{
    "message": "Post created successfully",
    "data": [
        {
            "data": {
                "publish_id": "v_pub_url~v2.7561015427574188089"
            },
            "error": {
                "code": "ok",
                "message": "",
                "log_id": "202510141802024E88FBDF61365E016730"
            }
        }
    ]
}`}</code>
                                </pre>
                                <p className="text-sm mt-2">
                                    The response confirms your video post was created successfully and includes the publish_id from TikTok.
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card className="bg-[#B4F8C8] border-1 border-black">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        5. Done!
                    </CardTitle>
                    <CardDescription className="text-black font-bold">
                        Now your content is live on your social media accounts!
                    </CardDescription>
                </CardHeader>
            </Card>
        </>
    )
}

export default GettingStartedDocs
