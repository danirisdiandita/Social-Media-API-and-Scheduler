'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Calendar as CalendarIcon, Clock, Send, Image as ImageIcon, ChevronDown, GripVertical, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useConnection } from '@/hooks/useConnection'
import { useUploadFile } from '@/hooks/useUploadFile'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Config } from '@/constants/config'
import { usePost } from '@/hooks/usePost'
import { toast } from 'sonner'

interface DraggableImageProps {
    file: File
    index: number
    moveImage: (dragIndex: number, hoverIndex: number) => void
    removeImage: (index: number) => void
}

const DraggableImage: React.FC<DraggableImageProps> = ({ file, index, moveImage, removeImage }) => {
    const ref = useRef<HTMLDivElement>(null)

    const [{ isDragging }, drag] = useDrag({
        type: 'image',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const [, drop] = useDrop({
        accept: 'image',
        hover: (item: { index: number }) => {
            if (!ref.current) return
            const dragIndex = item.index
            const hoverIndex = index
            if (dragIndex === hoverIndex) return
            moveImage(dragIndex, hoverIndex)
            item.index = hoverIndex
        },
    })

    drag(drop(ref))

    return (
        <div
            ref={ref}
            className={`relative group cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'
                }`}
        >
            <div className="relative w-full border-4 border-black" style={{ paddingBottom: '177.78%' }}>
                <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 p-1.5 bg-yellow-300 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-black" strokeWidth={2.5} />
                </div>
                <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </div>
            <p className="text-xs font-bold mt-1 truncate">{file.name}</p>
        </div>
    )
}

const PhotoPostPage = () => {
    const [images, setImages] = useState<File[]>([])
    const [caption, setCaption] = useState('')
    const [selectedConnections, setSelectedConnections] = useState<string[]>([])
    const [postType, setPostType] = useState<'direct' | 'schedule'>('direct')
    const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date())
    const [scheduleTime, setScheduleTime] = useState('10:30:00')
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [postSuccess, setPostSuccess] = useState(false)
    const { data } = useConnection(1, 999)
    const { uploadFiles, isUploading } = useUploadFile()
    const { doPosting, isPosting } = usePost()

    const isProcessing = isUploading || isPosting

    // Map social media to icons
    const socialMediaIcons: Record<string, string> = {
        'facebook': '📘',
        'twitter': '🐦',
        'instagram': '📷',
        'linkedin': '💼',
        'tiktok': '🎵',
        'youtube': '📺',
        'whatsapp': '💬'
    }

    const connections = data?.data?.map((conn: any) => ({
        id: conn.id.toString(),
        name: conn.display_name,
        icon: socialMediaIcons[conn.social_media.toLowerCase()] || '🔗',
        socialMedia: conn.social_media,
        avatarUrl: conn.avatar_url,
        connectionSlug: conn.connection_slug
    })) || []

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImages(prev => [...prev, ...acceptedFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        multiple: true
    })

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
        setImages((prevImages) => {
            const newImages = [...prevImages]
            const draggedImage = newImages[dragIndex]
            newImages.splice(dragIndex, 1)
            newImages.splice(hoverIndex, 0, draggedImage)
            return newImages
        })
    }, [])

    const toggleConnection = (id: string) => {
        setSelectedConnections(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const handleSubmit = async () => {
        const postData = {
            images: images.map(img => img.name),
            caption,
            connections: connections.filter((conn: {
                id: string;
                name: string;
                icon: string;
                socialMedia: string;
                avatarUrl: string;
                connectionSlug: string;
            }) => {
                console.log("conn_", conn)
                return selectedConnections.includes(conn.id)
            }),
            postType,
            ...(postType === 'schedule' && { scheduleDate, scheduleTime })
        }
        console.log('Post data:', postData)

        // upload each image to uploader 
        const fileMapping = await uploadFiles(images)


        console.log("fileMapping", fileMapping)

        // {
        //     "0.jpg": "7aad7fdf-5a53-4346-91cf-324afdc77610.jpeg",
        //     "1.jpg": "7f6b3730-ef42-4aa3-b708-f640ca5502c7.jpeg",
        //     "2.jpg": "0f24cf9e-a65b-4622-9f96-f2bafbf055fe.jpeg",
        //     "3.jpg": "bf1c3f3a-461f-4808-86ad-a922f044f16d.jpeg",
        //     "4.jpg": "bc1437ca-be5d-4ba6-b6c3-3d02fea1bb9b.jpeg"
        // }

        // get image ids of each image 

        const env_ = Config.NEXT_PUBLIC_ENV
        const imageIds = images.map(img => fileMapping[img.name])
        const postPayload = {
            title: postData.caption,
            caption: postData.caption,
            connections: postData.connections.map((conn: {
                id: string;
                name: string;
                icon: string;
                socialMedia: string;
                avatarUrl: string;
                connectionSlug: string;
            }) => conn.connectionSlug),
            privacy: env_ === 'development' ? 'SELF_ONLY' : 'PUBLIC_TO_EVERYONE',
            media_type: 'PHOTO',
            media_ids: imageIds
        }
        console.log("postPayload", JSON.stringify(postPayload, null, 2))
        try {
            const postResponse = await doPosting(postPayload)
            if (postResponse) {
                setPostSuccess(true)
                toast.success('Photos posted successfully!', {
                    duration: 5000,
                    position: "top-center",
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
                toast.error(`Error posting photos: ${error.message}`, {
                    duration: 5000,
                    position: "top-center",
                })
            }
        }
    }

    const resetForm = () => {
        setImages([])
        setCaption('')
        setSelectedConnections([])
        setPostSuccess(false)
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen w-full">
                <div className="flex items-center justify-between p-4 border-b-4 border-black">
                    <div>
                        <h1 className="text-2xl font-black">{postSuccess ? 'Post Successful!' : 'Create Photo Post'}</h1>
                        <p className="text-sm font-medium">
                            {postSuccess ? 'Your photos have been posted successfully' : 'Upload images and share them with your connections'}
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {postSuccess ? (
                        <div className="max-w-2xl mx-auto">
                            <div className="flex flex-col items-center justify-center py-16 space-y-6">
                                <div className="w-24 h-24 border-4 border-black bg-green-300 flex items-center justify-center">
                                    <CheckCircle2 className="w-12 h-12 text-black" strokeWidth={3} />
                                </div>
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-black">Photos Posted Successfully!</h2>
                                    <p className="text-sm font-medium">
                                        Your photos have been shared with your selected connections.
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button onClick={resetForm} className="gap-2">
                                        <Upload className="w-4 h-4" />
                                        Post Again
                                    </Button>
                                    <Button variant="outline" onClick={() => window.history.back()}>
                                        Go Back
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Image Upload Section */}
                        <div className="space-y-3">
                            <Label className="text-base font-black uppercase">Upload Images</Label>
                            <div
                                {...getRootProps()}
                                className={`border-4 border-black p-8 text-center transition-all ${
                                    isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                } ${isDragActive ? 'bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                            >
                                <input {...getInputProps()} disabled={isProcessing} />
                                <Upload className="w-12 h-12 mx-auto mb-4 text-black" strokeWidth={2.5} />
                                {isDragActive ? (
                                    <p className="font-black text-black">Drop the images here...</p>
                                ) : (
                                    <div>
                                        <p className="font-bold mb-1">Drag & drop images here, or click to select</p>
                                        <p className="text-sm font-medium">Supports: PNG, JPG, JPEG, GIF, WEBP</p>
                                    </div>
                                )}
                            </div>

                            {/* Preview Images */}
                            {images.length > 0 && (
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {images.map((file, index) => (
                                        <div key={index} className="w-32">
                                            <DraggableImage
                                                file={file}
                                                index={index}
                                                moveImage={moveImage}
                                                removeImage={removeImage}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Caption Section */}
                        <div className="space-y-3">
                            <Label htmlFor="caption" className="text-base font-black uppercase">Caption</Label>
                            <Textarea
                                id="caption"
                                placeholder="Write a caption for your post..."
                                value={caption}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
                                className="min-h-[120px] resize-none border-4 border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                disabled={isProcessing}
                            />
                            <p className="text-xs font-bold">{caption.length} characters</p>
                        </div>

                        {/* Choose Connections */}
                        <div className="space-y-3">
                            <Label className="text-base font-black uppercase">Choose Connections</Label>
                            {connections.length === 0 ? (
                                <div className="p-8 border-4 border-black text-center bg-white">
                                    <p className="font-bold">No connections available. Please connect your social media accounts first.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {connections.map((connection: any) => (
                                            <button
                                                key={connection.id}
                                                onClick={() => toggleConnection(connection.id)}
                                                disabled={isProcessing}
                                                className={`p-4 border-4 border-black text-center transition-all ${
                                                    isProcessing ? 'cursor-not-allowed opacity-50' : ''
                                                } ${selectedConnections.includes(connection.id)
                                                    ? 'bg-blue-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                                    : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                                                    }`}
                                            >
                                                {connection.avatarUrl ? (
                                                    <img
                                                        src={connection.avatarUrl}
                                                        alt={connection.name}
                                                        className="w-12 h-12 border-2 border-black mx-auto mb-2 object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-3xl mb-2">{connection.icon}</div>
                                                )}
                                                <p className="text-sm font-bold truncate">{connection.name}</p>
                                                <p className="text-xs font-medium capitalize">{connection.socialMedia}</p>
                                            </button>
                                        ))}
                                    </div>
                                    {selectedConnections.length > 0 ? (
                                        <p className="text-sm font-bold">
                                            {selectedConnections.length} connection(s) selected
                                        </p>
                                    ) : (
                                        <p className="text-sm font-bold">
                                            No connection selected
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Post Options */}
                        <div className="flex gap-6">
                            <div className="flex-1 space-y-3">
                                <Label className="text-base font-black uppercase">Post Options</Label>
                                <RadioGroup value={postType} onValueChange={(value: any) => setPostType(value)} className='flex items-center gap-2 cursor-pointer flex-1'>
                                    <RadioGroupItem value="direct" id="direct" />
                                    <Label htmlFor="direct" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <Send className="w-4 h-4" />
                                        <span>Post Directly</span>
                                    </Label>
                                    <RadioGroupItem value="schedule" id="schedule" className='flex justify-start' disabled />
                                    <Label htmlFor="schedule" className="flex items-center gap-2 cursor-not-allowed flex-1 opacity-50">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>Schedule Post</span>
                                        <Badge variant="outline" className="ml-2 text-xs border-2 border-black font-bold">Coming Soon</Badge>
                                    </Label>
                                </RadioGroup>
                            </div>

                            {/* Schedule Options */}
                            {postType === 'schedule' && (
                                <div className="flex-1 space-y-3 p-4 border-4 border-black bg-yellow-100">
                                    <Label className="text-base font-black uppercase">Schedule Date & Time</Label>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="date-picker" className="px-1 flex items-center gap-2 font-bold">
                                                <CalendarIcon className="w-4 h-4" />
                                                Date
                                            </Label>
                                            <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        id="date-picker"
                                                        className="w-48 justify-between font-bold"
                                                    >
                                                        {scheduleDate ? scheduleDate.toLocaleDateString() : "Select date"}
                                                        <ChevronDown className="w-4 h-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto overflow-hidden p-0 border-4 border-black" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={scheduleDate}
                                                        onSelect={(date) => {
                                                            setScheduleDate(date)
                                                            setOpenDatePicker(false)
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="time-picker" className="px-1 flex items-center gap-2 font-bold">
                                                <Clock className="w-4 h-4" />
                                                Time
                                            </Label>
                                            <Input
                                                type="time"
                                                id="time-picker"
                                                step="1"
                                                value={scheduleTime}
                                                onChange={(e) => setScheduleTime(e.target.value)}
                                                className="bg-white border-4 border-black appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => window.history.back()} disabled={isProcessing}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={images.length === 0 || selectedConnections.length === 0 || isProcessing}
                                className="gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {isUploading ? 'Uploading...' : 'Posting...'}
                                    </>
                                ) : postType === 'direct' ? (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Post Now
                                    </>
                                ) : (
                                    <>
                                        <CalendarIcon className="w-4 h-4" />
                                        Schedule Post
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </DndProvider>
    )
}

export default PhotoPostPage