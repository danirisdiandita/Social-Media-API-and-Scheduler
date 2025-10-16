"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Config } from '@/constants/config'
import { Copy } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

const ApiDocumentation = () => {
    const uploadFileExample = `curl --location "${Config.NEXT_PUBLIC_URL}/api/file" \\
--header 'Authorization: Bearer <API_KEY>' \\
--form 'file=@"/Users/yourname/location/folder/0.jpg"' \\
--form 'file=@"/Users/yourname/location/folder/1.jpg"' \\
--form 'file=@"/Users/yourname/location/folder/2.jpg"' \\
--form 'file=@"/Users/yourname/location/folder/3.jpg"' \\
--form 'file=@"/Users/yourname/location/folder/4.jpg"'
`

    const uploadVideoExample = `curl --location "${Config.NEXT_PUBLIC_URL}/api/file" \\
--header 'Authorization: Bearer <API_KEY>' \\
--form 'file=@"/Users/yourname/location/folder/video.mp4"'
`

    const postExample = `curl --location '${Config.NEXT_PUBLIC_URL}/api/posts' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer <API_KEY>' \\
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

    const postVideoExample = `curl --location '${Config.NEXT_PUBLIC_URL}/api/posts' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer <API_KEY>' \\
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
                    <CardTitle>Upload File API</CardTitle>
                    <CardDescription>Upload your Media to AutoPosting, you need your API Key to use this API</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-black mb-2 text-lg">POST /api/file</h4>
                        <p className="text-sm mb-3">
                            Upload your Photos or a Video to AutoPosting
                        </p>
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-sm font-black mb-2">Headers</h5>
                                <div className="border-1 border-black overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Field Name</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Value</TableHead>
                                                <TableHead>Required</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-bold">Authorization</TableCell>
                                                <TableCell>Use the API key for authentication, which can be obtained from <Link href="/api-keys" className="underline font-bold hover:text-[#FF6B6B]">API Keys</Link></TableCell>
                                                <TableCell><code className="text-xs bg-[#FFE66D] px-2 py-1 border-2 border-black">Bearer {'{$ApiKey}'}</code></TableCell>
                                                <TableCell>true</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <div>
                                <h5 className="text-sm font-black mb-2">Body</h5>
                                <div className="border-1 border-black overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Field Name</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Required</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-bold">file</TableCell>
                                                <TableCell><code className="text-xs bg-[#A0E7E5] px-2 py-1 border-2 border-black">multipart/form-data</code></TableCell>
                                                <TableCell className="max-w-md">
                                                    <div className="space-y-1">
                                                        <p className="text-sm">The file(s) to upload. You can upload multiple images or a single video.</p>
                                                        <p className="text-sm">Please ensure that the height and width of image files are less than 1080px.</p>
                                                        <p className="text-xs">
                                                            See <a href="https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-[#FF6B6B]">TikTok media requirements</a>
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>true</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <div>
                                <h5 className="text-sm font-black mb-2">Example Request</h5>
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
                                            <h6 className="text-sm font-black mb-2">Response:</h6>
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
                                                The response returns a mapping of your original filenames to the generated media IDs that you'll use in your post requests.
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
                                            <h6 className="text-sm font-black mb-2">Response:</h6>
                                            <pre className="bg-black text-[#00FF00] p-4 border-1 border-black overflow-x-auto font-mono">
                                                <code className="text-sm">{`{
    "video.mp4": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6.mp4"
}`}</code>
                                            </pre>
                                            <p className="text-sm mt-2">
                                                The response returns a mapping of your original filename to the generated media ID that you'll use in your post request.
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Posts API</CardTitle>
                    <CardDescription>Create and publish posts to your connected social media accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-black mb-2 text-lg">POST /api/posts</h4>
                        <p className="text-sm mb-3">
                            Create a new post on TikTok using uploaded media
                        </p>
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-sm font-black mb-2">Headers</h5>
                                <div className="border-1 border-black overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Field Name</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Value</TableHead>
                                                <TableHead>Required</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-bold">Authorization</TableCell>
                                                <TableCell>Use the API key for authentication, which can be obtained from <Link href="/api-keys" className="underline font-bold hover:text-[#FF6B6B]">API Keys</Link></TableCell>
                                                <TableCell><code className="text-xs bg-[#FFE66D] px-2 py-1 border-2 border-black">Bearer {'{$ApiKey}'}</code></TableCell>
                                                <TableCell>true</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">Content-Type</TableCell>
                                                <TableCell>The content format of the request body</TableCell>
                                                <TableCell><code className="text-xs bg-[#A0E7E5] px-2 py-1 border-2 border-black">application/json</code></TableCell>
                                                <TableCell>true</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <div>
                                <h5 className="text-sm font-black mb-2">Body</h5>
                                <div className="border-1 border-black overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Field Name</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Required</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-bold">title</TableCell>
                                                <TableCell><code className="text-xs bg-[#B4F8C8] px-2 py-1 border-2 border-black">string</code></TableCell>
                                                <TableCell className="max-w-md">The title of your post</TableCell>
                                                <TableCell>true</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">caption</TableCell>
                                                <TableCell><code className="text-xs bg-[#B4F8C8] px-2 py-1 border-2 border-black">string</code></TableCell>
                                                <TableCell className="max-w-md">The caption/description for your post</TableCell>
                                                <TableCell>true</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">connections</TableCell>
                                                <TableCell><code className="text-xs bg-[#FFAAA5] px-2 py-1 border-2 border-black">string[]</code></TableCell>
                                                <TableCell className="max-w-md">
                                                    <div className="space-y-1">
                                                        <p className="text-sm">Array of connection IDs to post to</p>
                                                        <p className="text-xs">
                                                            Get from <Link href="/connections" className="underline font-bold hover:text-[#FF6B6B]">Connections</Link>
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>true</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">privacy</TableCell>
                                                <TableCell><code className="text-xs bg-[#B4F8C8] px-2 py-1 border-2 border-black">string</code></TableCell>
                                                <TableCell className="max-w-md">
                                                    <div className="space-y-1">
                                                        <p className="text-sm">Privacy level for the post</p>
                                                        <p className="text-xs">
                                                            Options: SELF_ONLY, MUTUAL_FOLLOW_FRIENDS, FOLLOWER_OF_CREATOR, PUBLIC_TO_EVERYONE
                                                        </p>
                                                        <p className="text-xs">(default: PUBLIC_TO_EVERYONE)</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>false</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">media_type</TableCell>
                                                <TableCell><code className="text-xs bg-[#B4F8C8] px-2 py-1 border-2 border-black">string</code></TableCell>
                                                <TableCell className="max-w-md">
                                                    <div className="space-y-1">
                                                        <p className="text-sm">Type of media being posted</p>
                                                        <p className="text-xs">
                                                            Options: PHOTO, VIDEO
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>true</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">media_ids</TableCell>
                                                <TableCell><code className="text-xs bg-[#FFAAA5] px-2 py-1 border-2 border-black">string[]</code></TableCell>
                                                <TableCell className="max-w-md">
                                                    <div className="space-y-1">
                                                        <p className="text-sm">Array of media IDs from the upload endpoint</p>
                                                        <p className="text-xs">
                                                            Multiple IDs for photos, single ID for video
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>true</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <div>
                                <h5 className="text-sm font-black mb-2">Example Request</h5>
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
                                            <h6 className="text-sm font-black mb-2">Response:</h6>
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
                                            <h6 className="text-sm font-black mb-2">Response:</h6>
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
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Error Handling</CardTitle>
                    <CardDescription>Understanding API error responses</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm">
                            The API uses standard HTTP status codes and returns errors in the following format:
                        </p>
                        <pre className="bg-black text-[#FF6B6B] p-3 border-1 border-black overflow-x-auto text-xs font-mono">
                            {`{
    "message": "Invalid API key",
    "data": [
        {
            "error": {
                "code": "401",
                "message": "Invalid API key"
            }
        }
    ]
}`}
                        </pre>
                        <div>
                            <p className="text-sm font-black mb-2">Common Status Codes:</p>
                            <ul className="space-y-2">
                                <li className="text-sm"><code className="bg-[#B4F8C8] px-2 py-1 border-2 border-black font-bold">200/ok</code> - Success</li>
                                <li className="text-sm"><code className="bg-[#FFE66D] px-2 py-1 border-2 border-black font-bold">400</code> - Bad Request</li>
                                <li className="text-sm"><code className="bg-[#FFAAA5] px-2 py-1 border-2 border-black font-bold">401</code> - Unauthorized (invalid API key)</li>
                                <li className="text-sm"><code className="bg-[#A0E7E5] px-2 py-1 border-2 border-black font-bold">404</code> - Not Found</li>
                                <li className="text-sm"><code className="bg-[#FBE7C6] px-2 py-1 border-2 border-black font-bold">429</code> - Too Many Requests (rate limit exceeded)</li>
                                <li className="text-sm"><code className="bg-[#FF6B6B] px-2 py-1 border-2 border-black font-bold">500</code> - Internal Server Error</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default ApiDocumentation
