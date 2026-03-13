'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Calendar as CalendarIcon, Clock, Send, Image as ImageIcon, ChevronDown, ChevronLeft, ChevronRight, GripVertical, CheckCircle2, Loader2, ArrowLeft, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useConnection } from '@/hooks/useConnection'
import { useUploadFile } from '@/hooks/useUploadFile'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Config } from '@/constants/config'
import { usePost } from '@/hooks/usePost'
import { toast } from 'sonner'
import { useCreatorInfo, SPAM_RISK_CODES } from '@/hooks/useCreatorInfo'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect } from 'react'

interface DraggableImageProps {
    file: File
    index: number
    moveImage: (dragIndex: number, hoverIndex: number) => void
    removeImage: (index: number) => void
    setPreviewPhoto: (file: File) => void
}

const DraggableImage: React.FC<DraggableImageProps> = ({ file, index, moveImage, removeImage, setPreviewPhoto }) => {
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
            className={`relative group cursor-pointer ${isDragging ? 'opacity-50' : 'opacity-100'
                }`}
            onClick={() => setPreviewPhoto(file)}
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
    const [title, setTitle] = useState('')
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
    const { getCreatorInfo, creatorInfo, isLoading: isLoadingInfo } = useCreatorInfo()
    const [loadingConnectionId, setLoadingConnectionId] = useState<string | null>(null)
    const [connectionDetails, setConnectionDetails] = useState<Record<string, any>>({})
    const [privacySelections, setPrivacySelections] = useState<Record<string, string>>({})
    const [previewPhoto, setPreviewPhoto] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [interactionSettings, setInteractionSettings] = useState<Record<string, Record<string, boolean>>>({})

    useEffect(() => {
        if (previewPhoto) {
            const url = URL.createObjectURL(previewPhoto)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        }
        setPreviewUrl(null)
    }, [previewPhoto])

    useEffect(() => {
        if (creatorInfo && creatorInfo.data) {
            // This syncs the latest fetched info, but toggleConnection handles 
            // the mapping to specific IDs for multiple selections.
        }
    }, [creatorInfo])

    const isProcessing = isUploading || isPosting || isLoadingInfo

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
        connectionSlug: conn.connection_slug,
        username: conn.username
    })) || []

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImages(prev => {
            const newImages = [...prev, ...acceptedFiles]
            if (!previewPhoto && newImages.length > 0) {
                setPreviewPhoto(newImages[0])
            }
            return newImages
        })
    }, [previewPhoto])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        multiple: true
    })

    const removeImage = (index: number) => {
        setImages(prev => {
            const targetFile = prev[index]
            const newImages = prev.filter((_, i) => i !== index)
            if (previewPhoto === targetFile) {
                setPreviewPhoto(newImages.length > 0 ? newImages[0] : null)
            }
            return newImages
        })
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

    const toggleConnection = async (id: string) => {
        const isSelecting = !selectedConnections.includes(id)

        if (isSelecting) {
            setLoadingConnectionId(id)
            setSelectedConnections(prev => [...prev, id])
            try {
                const info = await getCreatorInfo({ connectionId: id })
                if (info) {
                    setConnectionDetails(prev => ({ ...prev, [id]: info }))
                }
            } catch (err) {
                console.error(`Failed to fetch info for connection ${id}:`, err)
            } finally {
                setLoadingConnectionId(null)
            }
        } else {
            setSelectedConnections(prev => prev.filter((c: string) => c !== id))
            setInteractionSettings(prev => {
                const next = { ...prev }
                delete next[id]
                return next
            })
        }
    }

    const currentIndex = previewPhoto ? images.indexOf(previewPhoto) : -1

    const goToPrev = () => {
        if (images.length === 0) return
        const newIndex = (currentIndex - 1 + images.length) % images.length
        setPreviewPhoto(images[newIndex])
    }

    const goToNext = () => {
        if (images.length === 0) return
        const newIndex = (currentIndex + 1) % images.length
        setPreviewPhoto(images[newIndex])
    }

    const handleSubmit = async () => {
        const postData = {
            images: images.map(img => img.name),
            title,
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

        const imageIds = images.map(img => fileMapping[img.name])

        // Check if all selected connections that have privacy options have a selection
        const privacyNotSelected = selectedConnections.some(id => {
            const info = connectionDetails[id]?.data;
            return info?.privacy_level_options && !privacySelections[id];
        });

        if (privacyNotSelected) {
            toast.error('Please select a privacy level for all selected accounts', {
                position: "top-center",
            });
            return;
        }

        const activePrivacy = privacySelections[selectedConnections[0]] || "";

        const postPayload = {
            title: title || caption,
            caption: caption,
            connections: postData.connections.map((conn: {
                id: string;
                name: string;
                icon: string;
                socialMedia: string;
                avatarUrl: string;
                connectionSlug: string;
            }) => conn.connectionSlug),
            privacy: activePrivacy,
            media_type: 'PHOTO',
            media_ids: imageIds,
            disable_comment: interactionSettings[selectedConnections[0]]?.comment === false,
            disable_duet: interactionSettings[selectedConnections[0]]?.duet === false,
            disable_stitch: interactionSettings[selectedConnections[0]]?.stitch === false,
            brand_content_toggle: interactionSettings[selectedConnections[0]]?.branded_content || false,
            brand_organic_toggle: interactionSettings[selectedConnections[0]]?.brand_organic || false,
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
        setTitle('')
        setCaption('')
        setSelectedConnections([])
        setPostSuccess(false)
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen w-full">
                <div className="flex items-center gap-4 p-4 border-b-4 border-black">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.history.back()}
                        className="w-10 h-10 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] shrink-0"
                    >
                        <ArrowLeft className="w-6 h-6 text-black" strokeWidth={3} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black">{postSuccess ? 'Post Successful!' : 'Create Photo Post'}</h1>
                        <p className="text-sm font-medium">
                            {postSuccess ? 'Your photos have been posted successfully' : 'Upload images and share them with your connections'}
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#fafafa]">
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
                        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 items-start">
                            {/* Form Section */}
                            <div className="flex-1 w-full space-y-6">
                                {/* Image Upload Section */}
                                <div className="space-y-3">
                                    <Label className="text-base font-black uppercase">Photo Content</Label>
                                    <div
                                        {...getRootProps()}
                                        className={`border-4 border-black p-8 text-center transition-all ${isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
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
                                                        setPreviewPhoto={setPreviewPhoto}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Title Section */}
                                <div className="space-y-3">
                                    <Label htmlFor="title" className="text-base font-black uppercase">Post Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Enter a title for your post..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="border-4 border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white h-12 font-bold"
                                        disabled={isProcessing}
                                    />
                                </div>

                                {/* Caption Section */}
                                <div className="space-y-3">
                                    <Label htmlFor="caption" className="text-base font-black uppercase">Caption</Label>
                                    <Textarea
                                        id="caption"
                                        placeholder="Write a caption for your post..."
                                        value={caption}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
                                        className="min-h-[120px] resize-none border-4 border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
                                        disabled={isProcessing}
                                    />
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold">{caption.length} characters</p>
                                    </div>
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
                                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                {connections.map((connection: any) => (
                                                    <button
                                                        key={connection.id}
                                                        onClick={() => toggleConnection(connection.id)}
                                                        disabled={isProcessing || loadingConnectionId === connection.id}
                                                        className={`p-4 border-4 border-black text-center transition-all relative ${isProcessing ? 'cursor-not-allowed opacity-50' : ''
                                                            } ${selectedConnections.includes(connection.id)
                                                                ? 'bg-blue-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                                                : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                                                            }`}
                                                    >
                                                        {loadingConnectionId === connection.id && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-blue-300/50 z-10">
                                                                <Loader2 className="w-8 h-8 animate-spin text-black" />
                                                            </div>
                                                        )}
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
                                                        {connection.username && (
                                                            <p className="text-[10px] font-bold text-gray-600 truncate lowercase">@{connection.username}</p>
                                                        )}
                                                        <p className="text-xs font-medium capitalize mt-1">{connection.socialMedia}</p>
                                                    </button>
                                                ))}
                                            </div>
                                            {selectedConnections.length > 0 ? (
                                                <p className="text-sm font-bold text-blue-600">
                                                    ✨ {selectedConnections.length} connection(s) selected
                                                </p>
                                            ) : (
                                                <p className="text-sm font-bold text-gray-500">
                                                    No connection selected
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Connection Details / Platform Settings */}
                                {selectedConnections.filter((id: string) => connectionDetails[id]).length > 0 && (
                                    <div className="space-y-4">
                                        <Label className="text-base font-black uppercase">Platform Integration Details</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedConnections.map((id: string) => {
                                                const info = connectionDetails[id]?.data;
                                                const error = connectionDetails[id]?.error;
                                                const conn = connections.find((c: any) => c.id === id);
                                                if (!info) return null;

                                                const isBlocked = error && SPAM_RISK_CODES.includes(error.code);

                                                return (
                                                    <div key={id} className={`p-4 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 ${isBlocked ? 'border-red-500 bg-red-50 opacity-90' : ''}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-14 h-14 border-4 border-black overflow-hidden shrink-0">
                                                                <img
                                                                    src={info.creator_avatar_url || conn?.avatarUrl}
                                                                    alt={info.creator_nickname}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${info.creator_nickname || 'User'}&background=random`
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-black text-sm truncate uppercase">{info.creator_nickname}</h4>
                                                                <p className="text-xs font-bold text-gray-500 truncate lowercase">@{info.creator_username}</p>
                                                                <Badge className="mt-1 bg-yellow-300 text-black border-2 border-black font-black text-[10px] uppercase">
                                                                    {conn?.socialMedia}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {isBlocked && (
                                                            <div className="p-2 border-2 border-black bg-red-500 text-white font-black text-[10px] uppercase leading-tight">
                                                                Posting Disabled: {error.message}
                                                            </div>
                                                        )}

                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-black uppercase text-gray-500">Post Privacy</Label>
                                                            <Select
                                                                value={privacySelections[id] || ""}
                                                                onValueChange={(value) => setPrivacySelections(prev => ({ ...prev, [id]: value }))}
                                                                disabled={isBlocked}
                                                            >
                                                                <SelectTrigger className="w-full border-4 border-black bg-white font-bold h-10">
                                                                    <SelectValue placeholder="CHOOSE PRIVACY..." />
                                                                </SelectTrigger>
                                                                <SelectContent className="border-4 border-black">
                                                                    {info.privacy_level_options?.map((option: string) => (
                                                                        <SelectItem key={option} value={option} className="font-bold">
                                                                            {option.replace(/_/g, ' ')}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {!privacySelections[id] && !isBlocked && (
                                                                <p className="text-[10px] font-bold text-red-500 uppercase">Selection Required</p>
                                                            )}
                                                        </div>

                                                        {/* TikTok Interaction Settings */}
                                                        {conn?.socialMedia?.toLowerCase() === 'tiktok' && (
                                                            <div className="space-y-3 p-3 border-2 border-black bg-gray-50">
                                                                <Label className="text-[10px] font-black uppercase text-gray-500">Allow users to:</Label>
                                                                <div className="flex flex-row flex-wrap gap-4">
                                                                    {[
                                                                        { id: 'comment', label: 'Comment', disabled: info.comment_disabled },
                                                                        { id: 'duet', label: 'Duet', disabled: info.duet_disabled },
                                                                        { id: 'stitch', label: 'Stitch', disabled: info.stitch_disabled }
                                                                    ].filter(item => !item.disabled).map((item) => (
                                                                        <label
                                                                            key={item.id}
                                                                            className={`flex items-center gap-2 cursor-pointer ${item.disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                                                                        >
                                                                            <div className="relative">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={interactionSettings[id]?.[item.id] ?? (item.id === 'comment' ? !item.disabled : false)}
                                                                                    onChange={(e) => {
                                                                                        if (item.disabled) return;
                                                                                        setInteractionSettings(prev => ({
                                                                                            ...prev,
                                                                                            [id]: {
                                                                                                ...(prev[id] || { comment: !info.comment_disabled, duet: !info.duet_disabled && false, stitch: !info.stitch_disabled && false }),
                                                                                                [item.id]: e.target.checked
                                                                                            }
                                                                                        }));
                                                                                    }}
                                                                                    disabled={item.disabled || isBlocked}
                                                                                    className="peer appearance-none w-5 h-5 border-2 border-black bg-white checked:bg-yellow-300 transition-all cursor-pointer disabled:cursor-not-allowed"
                                                                                />
                                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
                                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-black" strokeWidth={4} />
                                                                                </div>
                                                                            </div>
                                                                            <span className="text-[10px] font-black uppercase">{item.label}</span>
                                                                            {item.disabled && (
                                                                                <Badge variant="outline" className="text-[8px] h-4 px-1 border-black bg-gray-200">DISABLED</Badge>
                                                                            )}
                                                                        </label>
                                                                    ))}
                                                                </div>

                                                                {/* Disclose Photo Content Toggle */}
                                                                <div className="pt-3 border-t-2 border-black border-dashed mt-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <Label className="text-[10px] font-black uppercase text-gray-500">Disclose photo content</Label>
                                                                        <button
                                                                            onClick={() => {
                                                                                setInteractionSettings(prev => ({
                                                                                    ...prev,
                                                                                    [id]: {
                                                                                        ...(prev[id] || {}),
                                                                                        disclose_content: !(prev[id]?.disclose_content ?? false)
                                                                                    }
                                                                                }));
                                                                            }}
                                                                            disabled={isBlocked}
                                                                            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${interactionSettings[id]?.disclose_content ? 'bg-yellow-300' : 'bg-gray-200'}`}
                                                                        >
                                                                            <span
                                                                                className={`pointer-events-none block h-4 w-4 rounded-full bg-white border-2 border-black shadow-none ring-0 transition-transform ${interactionSettings[id]?.disclose_content ? 'translate-x-5' : 'translate-x-0'}`}
                                                                            />
                                                                        </button>
                                                                    </div>

                                                                    {interactionSettings[id]?.disclose_content && (
                                                                        <div className="mt-3 space-y-4">
                                                                            {/* Dynamic Prompt Alert */}
                                                                            {(interactionSettings[id]?.brand_organic || interactionSettings[id]?.branded_content) && (
                                                                                <div className="p-3 border-2 border-black bg-blue-50 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                                                                                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                                                        <Info className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                                                                                    </div>
                                                                                    <p className="text-[11px] font-black leading-tight text-blue-800 uppercase">
                                                                                        {interactionSettings[id]?.brand_organic && interactionSettings[id]?.branded_content
                                                                                            ? "Your photo/video will be labeled as 'Paid partnership'"
                                                                                            : interactionSettings[id]?.branded_content
                                                                                                ? "Your photo/video will be labeled as 'Paid partnership'"
                                                                                                : "Your photo/video will be labeled as 'Promotional content'"}
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            <p className="text-[11px] font-medium leading-tight text-gray-600">
                                                                                Turn on to disclose that this photo promotes goods or services in exchange for something of value. Your photo could promote yourself, a third party, or both.
                                                                            </p>

                                                                            {/* Disclose Options */}
                                                                            <div className="space-y-4 pt-1">
                                                                                {/* Your Brand */}
                                                                                <div
                                                                                    className="flex items-start gap-3 cursor-pointer group"
                                                                                    onClick={() => {
                                                                                        setInteractionSettings(prev => ({
                                                                                            ...prev,
                                                                                            [id]: {
                                                                                                ...(prev[id] || {}),
                                                                                                brand_organic: !(prev[id]?.brand_organic ?? false)
                                                                                            }
                                                                                        }));
                                                                                    }}
                                                                                >
                                                                                    <div className="relative mt-1">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={interactionSettings[id]?.brand_organic ?? false}
                                                                                            onChange={() => { }}
                                                                                            className="peer appearance-none w-5 h-5 border-2 border-black bg-white checked:bg-yellow-300 transition-all cursor-pointer"
                                                                                        />
                                                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
                                                                                            <CheckCircle2 className="w-3.5 h-3.5 text-black" strokeWidth={4} />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[11px] font-black uppercase group-hover:text-blue-600 transition-colors">Your brand</p>
                                                                                        <p className="text-[10px] font-medium text-gray-500 leading-tight">
                                                                                            You are promoting yourself or your own business. This photo will be classified as Brand Organic.
                                                                                        </p>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Branded Content */}
                                                                                <div
                                                                                    className="flex items-start gap-3 cursor-pointer group"
                                                                                    onClick={() => {
                                                                                        setInteractionSettings(prev => ({
                                                                                            ...prev,
                                                                                            [id]: {
                                                                                                ...(prev[id] || {}),
                                                                                                branded_content: !(prev[id]?.branded_content ?? false)
                                                                                            }
                                                                                        }));
                                                                                    }}
                                                                                >
                                                                                    <div className="relative mt-1">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={interactionSettings[id]?.branded_content ?? false}
                                                                                            onChange={() => { }}
                                                                                            className="peer appearance-none w-5 h-5 border-2 border-black bg-white checked:bg-yellow-300 transition-all cursor-pointer"
                                                                                        />
                                                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
                                                                                            <CheckCircle2 className="w-3.5 h-3.5 text-black" strokeWidth={4} />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[11px] font-black uppercase group-hover:text-blue-600 transition-colors">Branded content</p>
                                                                                        <p className="text-[10px] font-medium text-gray-500 leading-tight">
                                                                                            You are promoting another brand or a third party. This photo will be classified as Branded Content.
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {!interactionSettings[id]?.brand_organic && !interactionSettings[id]?.branded_content && (
                                                                                <div className="p-2 border-2 border-black bg-yellow-100 text-[9px] font-black uppercase text-yellow-800 leading-tight flex items-center gap-2">
                                                                                    <Info className="w-3 h-3" />
                                                                                    <span>At least one option must be selected to proceed. You need to indicate if your content promotes yourself, a third party, or both.</span>
                                                                                </div>
                                                                            )}

                                                                            <p className="text-[11px] font-medium text-gray-500 pt-2">
                                                                                By posting, you agree to our <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">Music Usage Confirmation</a>.
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="mt-auto pt-2 border-t-2 border-black border-dashed flex flex-col gap-1">
                                                            <p className="text-[9px] font-bold text-blue-600 leading-tight italic">
                                                                * This is a photo post. Platform-specific duration checks not applicable.
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

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
                                        <div className="flex-1 space-y-3 p-4 border-4 border-black bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                                                                className="w-full xl:w-48 justify-between font-bold border-4 border-black"
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
                                <p className="text-[10px] font-bold text-gray-500 mb-2 text-right uppercase italic">
                                    By posting, you agree to TikTok&apos;s <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Music Usage Confirmation</a>
                                </p>
                                <div className="flex justify-end gap-3 pt-4 border-t-4 border-black border-dashed pb-8">
                                    <Button variant="outline" onClick={() => window.history.back()} disabled={isProcessing} className="border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                                        Cancel
                                    </Button>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <div className="inline-block">
                                                    <Button
                                                        onClick={handleSubmit}
                                                        disabled={
                                                            images.length === 0 ||
                                                            selectedConnections.length === 0 ||
                                                            isProcessing ||
                                                            selectedConnections.some(id => {
                                                                const error = connectionDetails[id]?.error;
                                                                const info = connectionDetails[id]?.data;
                                                                const settings = interactionSettings[id];
                                                                const isSpam = error && SPAM_RISK_CODES.includes(error.code);
                                                                const privacyNotSelected = info?.privacy_level_options && !privacySelections[id];
                                                                const isDisclosureInvalid = settings?.disclose_content && !settings?.brand_organic && !settings?.branded_content;
                                                                return isSpam || privacyNotSelected || isDisclosureInvalid;
                                                            })
                                                        }
                                                        className="gap-2 border-4 border-black font-black uppercase bg-green-400 hover:bg-green-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] h-12 px-8"
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                                {isUploading ? 'Uploading...' : 'Posting...'}
                                                            </>
                                                        ) : postType === 'direct' ? (
                                                            <>
                                                                <Send className="w-5 h-5" />
                                                                Post Now
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CalendarIcon className="w-5 h-5" />
                                                                Schedule Post
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </TooltipTrigger>
                                            {selectedConnections.some(id => interactionSettings[id]?.disclose_content && !interactionSettings[id]?.brand_organic && !interactionSettings[id]?.branded_content) && (
                                                <TooltipContent className="bg-yellow-100 border-4 border-black text-black font-bold max-w-xs p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                    <p className="text-xs uppercase">You need to indicate if your content promotes yourself, a third party, or both.</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Sidebar Preview Section */}
                            <div className="w-full lg:w-[400px] shrink-0 xl:sticky xl:top-6 space-y-4">
                                <div className="p-4 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="flex items-center gap-2 mb-4 border-b-4 border-black pb-2">
                                        <ImageIcon className="w-6 h-6 text-blue-600 fill-blue-200" />
                                        <h3 className="text-lg font-black uppercase leading-none">Content Preview</h3>
                                    </div>

                                    {previewPhoto ? (
                                        <div className="space-y-4">
                                            <div className="relative aspect-[9/16] bg-black border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group/preview">
                                                <img
                                                    key={previewPhoto.name}
                                                    src={previewUrl || ""}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />

                                                {images.length > 1 && (
                                                    <>
                                                        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                                                                className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all pointer-events-auto"
                                                            >
                                                                <ChevronLeft className="w-6 h-6 text-black" strokeWidth={3} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                                                className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all pointer-events-auto"
                                                            >
                                                                <ChevronRight className="w-6 h-6 text-black" strokeWidth={3} />
                                                            </button>
                                                        </div>
                                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 text-[10px] font-black border-2 border-white uppercase tracking-widest">
                                                            {currentIndex + 1} / {images.length}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="p-4 border-4 border-black bg-yellow-100 italic font-bold text-sm leading-tight">
                                                <p>✨ Previewing: <span className="text-blue-600">{previewPhoto.name}</span></p>
                                                <p className="mt-2 text-[10px] uppercase opacity-70">🎯 This is how your photo will appear in the post gallery.</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-2 border-2 border-black bg-gray-50 text-[10px] font-black uppercase text-center">
                                                    {(previewPhoto.size / (1024 * 1024)).toFixed(2)} MB
                                                </div>
                                                <div className="p-2 border-2 border-black bg-gray-50 text-[10px] font-black uppercase text-center">
                                                    {previewPhoto.type.split('/')[1] || 'image'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-[9/16] border-4 border-black border-dashed bg-gray-50 flex flex-col items-center justify-center text-center p-8 gap-4 grayscale opacity-40">
                                            <ImageIcon className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
                                            <p className="font-black text-sm uppercase">No image selected for preview</p>
                                            <p className="text-[10px] font-bold">Upload images and click one to see it here</p>
                                        </div>
                                    )}
                                </div>

                                {/* Publishing Info Sidebar */}
                                <div className="p-4 border-4 border-black bg-purple-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                    <h4 className="font-black text-xs uppercase mb-2">Photo Post Tips</h4>
                                    <ul className="text-[10px] font-bold space-y-2 list-disc pl-4">
                                        <li>High resolution images work best</li>
                                        <li>You can drag and drop images to reorder them</li>
                                        <li>Portrait aspect ratio (9:16) is ideal for mobile</li>
                                        <li>Ensure privacy is selected for all accounts</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DndProvider >
    )
}

export default PhotoPostPage