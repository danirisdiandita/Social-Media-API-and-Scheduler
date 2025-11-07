import React from 'react'
import Link from 'next/link'
import { Image, Video } from 'lucide-react'

const PostPage = () => {
    return (
        <div className="flex flex-col h-screen w-full">
            <div className="flex items-center justify-between p-4">
                <div>
                    <h1 className="text-2xl font-bold">Create Post</h1>
                    <p className="text-muted-foreground">
                        Create your post to your social media connections
                    </p>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Photo Post Card */}
                    <Link href="/posts/photos">
                        <div className="group border-4 border-black rounded-none p-8 cursor-pointer bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-yellow-300 border-4 border-black rounded-none">
                                    <Image className="w-12 h-12 text-black" strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl font-bold">Photo Post</h2>
                                <div className="mt-2 text-sm font-bold text-black uppercase">
                                    Create Now →
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Video Post Card */}
                    <Link href="/posts/video">
                        <div className="group border-4 border-black rounded-none p-8 cursor-pointer bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-blue-300 border-4 border-black rounded-none">
                                    <Video className="w-12 h-12 text-black" strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl font-bold">Video Post</h2>
                                <div className="mt-2 text-sm font-bold text-black uppercase">
                                    Create Now →
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PostPage