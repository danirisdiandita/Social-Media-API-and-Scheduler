'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Calendar as CalendarIcon, Clock, Send, Video as VideoIcon, ChevronDown, CheckCircle2, Loader2, ArrowLeft, Play, Info } from 'lucide-react'
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
import { Config } from '@/constants/config'
import { useUploadVideo } from '@/hooks/useUploadVideo'
import { usePost } from '@/hooks/usePost'
import { toast } from 'sonner'
import { useCreatorInfo, SPAM_RISK_CODES } from '@/hooks/useCreatorInfo'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect } from 'react'

// Mock social media connections
const mockConnections = [
  { id: '1', name: 'Facebook', icon: '📘', connected: true },
  { id: '2', name: 'Twitter', icon: '🐦', connected: true },
  { id: '3', name: 'Instagram', icon: '📷', connected: true },
  { id: '4', name: 'LinkedIn', icon: '💼', connected: true },
]

const VideoPostPage = () => {
  const [videos, setVideos] = useState<File[]>([])
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [selectedConnections, setSelectedConnections] = useState<string[]>([])
  const [postType, setPostType] = useState<'direct' | 'schedule'>('direct')
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined)
  const [scheduleTime, setScheduleTime] = useState('10:30:00')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const { data } = useConnection(1, 999)
  const { uploadVideos, isUploading } = useUploadVideo()
  const { doPosting, isPosting } = usePost()
  const { getCreatorInfo, creatorInfo, isLoading: isLoadingInfo } = useCreatorInfo()
  const [loadingConnectionId, setLoadingConnectionId] = useState<string | null>(null)
  const [connectionDetails, setConnectionDetails] = useState<Record<string, any>>({})
  const [privacySelections, setPrivacySelections] = useState<Record<string, string>>({})
  const [previewVideo, setPreviewVideo] = useState<File | null>(null)
  const [videoDuration, setVideoDuration] = useState<number | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [interactionSettings, setInteractionSettings] = useState<Record<string, Record<string, boolean>>>({})

  useEffect(() => {
    if (previewVideo) {
      const url = URL.createObjectURL(previewVideo)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [previewVideo])

  useEffect(() => {
    if (creatorInfo && creatorInfo.data) {
      // Syncing occurs in toggleConnection or via effect if needed
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

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setVideos([file])
      setPreviewVideo(file)
      try {
        const duration = await getVideoDuration(file)
        setVideoDuration(duration)
      } catch (err) {
        console.error("Failed to get video duration:", err)
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    multiple: false
  })

  const removeVideo = (index: number) => {
    setVideos(prev => {
      const newVideos = prev.filter((_, i) => i !== index)
      if (previewVideo === prev[index]) {
        setPreviewVideo(newVideos.length > 0 ? newVideos[0] : null)
        setVideoDuration(null)
      }
      return newVideos
    })
  }

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
      // Clean up settings if unselected
      setInteractionSettings(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleSubmit = async () => {
    const postData = {
      videos: videos.map(vid => ({ name: vid.name, size: vid.size, duration: videoDuration })),
      title,
      caption,
      connections: connections.filter((conn: {
        id: string;
        name: string;
        icon: string;
        socialMedia: string;
        avatarUrl: string;
        connectionSlug: string;
      }) => selectedConnections.includes(conn.id)),
      postType,
      ...(postType === 'schedule' && { scheduleDate, scheduleTime })
    }
    console.log('Post data:', postData)

    // Validate duration against all selected connections
    for (const id of selectedConnections) {
      const info = connectionDetails[id]?.data;
      if (info && videoDuration && videoDuration > info.max_video_post_duration_sec) {
        toast.error(`Video is too long for ${info.creator_nickname}. Max allowed is ${info.max_video_post_duration_sec}s`, {
          position: "top-center",
        })
        return
      }
    }

    // uploading videos 
    const fileMapping = await uploadVideos(videos)

    console.log("fileMapping", fileMapping)

    // get video ids of each video 
    const videoIds = videos.map(vid => fileMapping[vid.name])

    const activePrivacy = privacySelections[selectedConnections[0]]

    if (!activePrivacy && connectionDetails[selectedConnections[0]]?.privacy_level_options) {
      toast.error('Please select a privacy level for your post', {
        position: "top-center",
      })
      return
    }

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
      media_type: 'VIDEO',
      media_ids: videoIds,
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
        toast.success('Video posted successfully!', {
          duration: 5000,
          position: "top-center",
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        toast.error(`Error posting video: ${error.message}`, {
          duration: 5000,
          position: "top-center",
        })
      }
    }
  }

  const resetForm = () => {
    setVideos([])
    setTitle('')
    setCaption('')
    setSelectedConnections([])
    setPostSuccess(false)
    setVideoDuration(null)
  }

  return (
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
          <h1 className="text-2xl font-black">{postSuccess ? 'Post Successful!' : 'Create Video Post'}</h1>
          <p className="text-sm font-medium">
            {postSuccess ? 'Your video has been posted successfully' : 'Upload videos and share them with your connections'}
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
                <h2 className="text-2xl font-black">Video Posted Successfully!</h2>
                <p className="text-sm font-medium">
                  Your video has been shared with your selected connections.
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
              {/* Video Upload Section */}
              <div className="space-y-3">
                <Label className="text-base font-black uppercase">Video Content</Label>
                {videos.length === 0 && (
                  <div
                    {...getRootProps()}
                    className={`border-4 border-black p-8 text-center transition-all ${isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      } ${isDragActive ? 'bg-purple-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                  >
                    <input {...getInputProps()} disabled={isProcessing} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-black" strokeWidth={2.5} />
                    {isDragActive ? (
                      <p className="font-black text-black">Drop the video here...</p>
                    ) : (
                      <div>
                        <p className="font-bold mb-1">Drag & drop video here, or click to select</p>
                        <p className="text-sm font-medium">Supports: MP4, MOV, AVI, MKV, WEBM (One video only)</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Video List */}
                {videos.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {videos.map((file, index) => (
                      <div key={index} className={`flex items-center gap-4 p-4 border-4 border-black bg-white transition-all ${previewVideo === file ? 'ring-4 ring-purple-500 shadow-none translate-x-[2px] translate-y-[2px]' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                        <div className="flex-shrink-0 w-16 h-16 bg-purple-300 border-2 border-black flex items-center justify-center relative group cursor-pointer"
                          onClick={() => setPreviewVideo(file)}>
                          <VideoIcon className="w-8 h-8 text-black" strokeWidth={2.5} />
                          <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${previewVideo === file ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <Play className="w-6 h-6 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{file.name}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium">{formatFileSize(file.size)}</p>
                            {videoDuration && (
                              <>
                                <span className="text-gray-400">•</span>
                                <p className="text-sm font-bold text-purple-600">
                                  {Math.floor(videoDuration / 60)}:{Math.floor(videoDuration % 60).toString().padStart(2, '0')}
                                </p>
                              </>
                            )}
                            {selectedConnections.some(id => {
                              const info = connectionDetails[id]?.data;
                              return info && videoDuration && videoDuration > info.max_video_post_duration_sec;
                            }) && (
                                <Badge className="bg-red-500 text-white border-2 border-black font-black text-[10px] uppercase h-5 animate-pulse">
                                  ⚠️ TOO LONG FOR SOME ACCOUNTS
                                </Badge>
                              )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => removeVideo(index)}
                            disabled={isProcessing}
                            className="flex-shrink-0 p-2 bg-red-500 border-2 border-black hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                          >
                            <X className="w-5 h-5 text-white" strokeWidth={2.5} />
                          </button>
                        </div>
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
                  placeholder="Enter a title for your video post..."
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
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {connections.map((connection: any) => (
                        <button
                          key={connection.id}
                          onClick={() => toggleConnection(connection.id)}
                          disabled={isProcessing || loadingConnectionId === connection.id}
                          className={`p-4 border-4 border-black text-center transition-all relative ${isProcessing ? 'cursor-not-allowed opacity-50' : ''
                            } ${selectedConnections.includes(connection.id)
                              ? 'bg-purple-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                              : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                            }`}
                        >
                          {loadingConnectionId === connection.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-purple-300/50 z-10">
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
                            <p className="text-[10px] font-medium text-gray-600 truncate">
                              Creator&apos;s Nickname: <span className="font-bold">@{connection.username}</span>
                            </p>
                          )}
                          <p className="text-xs font-medium capitalize mt-1">{connection.socialMedia}</p>
                        </button>
                      ))}
                    </div>
                    {selectedConnections.length > 0 ? (
                      <p className="text-sm font-bold text-purple-600">
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
                              <Badge className="mt-1 bg-purple-300 text-black border-2 border-black font-black text-[10px] uppercase">
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
                                  {info.privacy_level_options?.map((option: string) => {
                                    const isSelfPrivate = option.toUpperCase() === 'SELF' || option.toUpperCase() === 'PRIVATE' || option.toUpperCase() === 'ONLY_ME';
                                    const isBrandedChecked = interactionSettings[id]?.branded_content;
                                    const isPrivacyDisabled = isSelfPrivate && isBrandedChecked;

                                    return (
                                      <SelectItem key={option} value={option} className="font-bold" disabled={isPrivacyDisabled}>
                                        {isPrivacyDisabled ? (
                                          <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <div className="w-full flex items-center justify-between pointer-events-auto">
                                                  <span>{option.replace(/_/g, ' ')}</span>
                                                  <Info className="w-4 h-4 ml-2 text-gray-400" />
                                                </div>
                                              </TooltipTrigger>
                                              <TooltipContent side="right" className="bg-yellow-100 border-4 border-black text-black font-bold p-3 max-w-xs z-[100] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                <p className="text-xs uppercase">Branded content visibility cannot be set to private.</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        ) : (
                                          option.replace(/_/g, ' ')
                                        )}
                                      </SelectItem>
                                    );
                                  })}
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
                                ].map((item) => (
                                  <label
                                    key={item.id}
                                    className={`flex items-center gap-2 cursor-pointer ${item.disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                                  >
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={interactionSettings[id]?.[item.id] ?? !item.disabled}
                                        onChange={(e) => {
                                          if (item.disabled) return;
                                          setInteractionSettings(prev => ({
                                            ...prev,
                                            [id]: {
                                              ...(prev[id] || { comment: !info.comment_disabled, duet: !info.duet_disabled, stitch: !info.stitch_disabled }),
                                              [item.id]: e.target.checked
                                            }
                                          }));
                                        }}
                                        disabled={item.disabled || isBlocked}
                                        className="peer appearance-none w-5 h-5 border-2 border-black bg-white checked:bg-[#00f2ea] transition-all cursor-pointer disabled:cursor-not-allowed"
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

                              {/* Disclose Video Content Toggle */}
                              <div className="pt-3 border-t-2 border-black border-dashed mt-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-[10px] font-black uppercase text-gray-500">Disclose video content</Label>
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
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${interactionSettings[id]?.disclose_content ? 'bg-[#00f2ea]' : 'bg-gray-200'}`}
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
                                      Turn on to disclose that this video promotes goods or services in exchange for something of value. Your video could promote yourself, a third party, or both.
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
                                            className="peer appearance-none w-5 h-5 border-2 border-black bg-white checked:bg-[#00f2ea] transition-all cursor-pointer"
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-black" strokeWidth={4} />
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-[11px] font-black uppercase group-hover:text-purple-600 transition-colors">Your brand</p>
                                          <p className="text-[10px] font-medium text-gray-500 leading-tight">
                                            You are promoting yourself or your own business. This video will be classified as Brand Organic.
                                          </p>
                                        </div>
                                      </div>

                                      {/* Branded Content */}
                                      <TooltipProvider delayDuration={0}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div
                                              className={`flex items-start gap-3 ${(privacySelections[id]?.toUpperCase() === 'SELF' || privacySelections[id]?.toUpperCase() === 'PRIVATE' || privacySelections[id]?.toUpperCase() === 'ONLY_ME') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}
                                              onClick={() => {
                                                if (privacySelections[id]?.toUpperCase() === 'SELF' || privacySelections[id]?.toUpperCase() === 'PRIVATE' || privacySelections[id]?.toUpperCase() === 'ONLY_ME') return;
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
                                                  disabled={privacySelections[id]?.toUpperCase() === 'SELF' || privacySelections[id]?.toUpperCase() === 'PRIVATE' || privacySelections[id]?.toUpperCase() === 'ONLY_ME'}
                                                  className={`peer appearance-none w-5 h-5 border-2 border-black bg-white checked:bg-[#00f2ea] transition-all ${(privacySelections[id]?.toUpperCase() === 'SELF' || privacySelections[id]?.toUpperCase() === 'PRIVATE' || privacySelections[id]?.toUpperCase() === 'ONLY_ME') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
                                                  <CheckCircle2 className="w-3.5 h-3.5 text-black" strokeWidth={4} />
                                                </div>
                                              </div>
                                              <div>
                                                <p className={`text-[11px] font-black uppercase ${!(privacySelections[id]?.toUpperCase() === 'SELF' || privacySelections[id]?.toUpperCase() === 'PRIVATE' || privacySelections[id]?.toUpperCase() === 'ONLY_ME') && 'group-hover:text-purple-600'} transition-colors`}>Branded content</p>
                                                <p className="text-[10px] font-medium text-gray-500 leading-tight">
                                                  You are promoting another brand or a third party. This video will be classified as Branded Content.
                                                </p>
                                              </div>
                                            </div>
                                          </TooltipTrigger>
                                          {(privacySelections[id]?.toUpperCase() === 'SELF' || privacySelections[id]?.toUpperCase() === 'PRIVATE' || privacySelections[id]?.toUpperCase() === 'ONLY_ME') && (
                                            <TooltipContent className="bg-yellow-100 border-4 border-black text-black font-bold p-3 max-w-xs z-[100] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                              <p className="text-xs uppercase">Visibility for branded content can't be private.</p>
                                            </TooltipContent>
                                          )}
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>

                                    {!interactionSettings[id]?.brand_organic && !interactionSettings[id]?.branded_content && (
                                      <div className="p-2 border-2 border-black bg-yellow-100 text-[9px] font-black uppercase text-yellow-800 leading-tight flex items-center gap-2">
                                        <Info className="w-3 h-3" />
                                        <span>At least one option must be selected to proceed. You need to indicate if your content promotes yourself, a third party, or both.</span>
                                      </div>
                                    )}

                                    <p className="text-[11px] font-medium text-gray-500 pt-2">
                                      {interactionSettings[id]?.branded_content ? (
                                        <>By posting, you agree to TikTok's <a href="https://www.tiktok.com/legal/page/global/bc-policy/en" target="_blank" rel="noopener noreferrer" className="text-[#00f2ea] font-bold hover:underline">Branded Content Policy</a> and <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer" className="text-[#00f2ea] font-bold hover:underline">Music Usage Confirmation</a>.</>
                                      ) : (
                                        <>By posting, you agree to TikTok's <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer" className="text-[#00f2ea] font-bold hover:underline">Music Usage Confirmation</a>.</>
                                      )}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="mt-auto pt-2 border-t-2 border-black border-dashed flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase">Max Video Limit:</span>
                              <span className="text-[10px] font-bold">{info.max_video_post_duration_sec}s</span>
                            </div>
                            {videoDuration && videoDuration > info.max_video_post_duration_sec && (
                              <p className="text-[9px] font-bold text-red-500 leading-tight uppercase bg-red-50 p-1 border border-red-200">
                                ⚠️ Video is too long for this platform!
                              </p>
                            )}
                            <p className="text-[9px] font-bold text-purple-600 leading-tight">
                              * Please ensure your video remains within this platform limit.
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
                  <div className="flex-1 space-y-3 p-4 border-4 border-black bg-purple-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
              <p className="text-[10px] font-bold text-gray-500 mb-2 text-right uppercase italic leading-tight px-1">
                {selectedConnections.some(id => interactionSettings[id]?.disclose_content && interactionSettings[id]?.branded_content) ? (
                  <>By posting, you expressly consent to send your content to TikTok and agree to TikTok&apos;s <a href="https://www.tiktok.com/legal/page/global/bc-policy/en" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Branded Content Policy</a> and <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Music Usage Confirmation</a></>
                ) : (
                  <>By posting, you expressly consent to send your content to TikTok and agree to TikTok&apos;s <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Music Usage Confirmation</a></>
                )}
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
                            videos.length === 0 ||
                            selectedConnections.length === 0 ||
                            isProcessing ||
                            selectedConnections.some(id => {
                              const error = connectionDetails[id]?.error;
                              const info = connectionDetails[id]?.data;
                              const settings = interactionSettings[id];
                              const isSpam = error && SPAM_RISK_CODES.includes(error.code);
                              const isTooLong = info && videoDuration && videoDuration > info.max_video_post_duration_sec;
                              const privacyNotSelected = info?.privacy_level_options && !privacySelections[id];
                              const isDisclosureInvalid = settings?.disclose_content && !settings?.brand_organic && !settings?.branded_content;
                              return isSpam || isTooLong || privacyNotSelected || isDisclosureInvalid;
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
                  <Play className="w-6 h-6 text-purple-600 fill-purple-200" />
                  <h3 className="text-lg font-black uppercase leading-none">Content Preview</h3>
                </div>

                {previewVideo ? (
                  <div className="space-y-4">
                    <div className="relative aspect-[9/16] bg-black border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <video
                        key={previewVideo.name}
                        src={previewUrl || ""}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="p-4 border-4 border-black bg-yellow-100 italic font-bold text-sm leading-tight">
                      <p>✨ Previewing: <span className="text-purple-600">{previewVideo.name}</span></p>
                      <p className="mt-2 text-[10px] uppercase opacity-70">🎯 This is exactly how your audience will see it!</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border-2 border-black bg-gray-50 text-[10px] font-black uppercase text-center">
                        {formatFileSize(previewVideo.size)}
                      </div>
                      <div className="p-2 border-2 border-black bg-gray-50 text-[10px] font-black uppercase text-center">
                        {videoDuration ? `${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60).toString().padStart(2, '0')}` : '...'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[9/16] border-4 border-black border-dashed bg-gray-50 flex flex-col items-center justify-center text-center p-8 gap-4 grayscale opacity-40">
                    <VideoIcon className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
                    <p className="font-black text-sm uppercase">No video selected for preview</p>
                    <p className="text-[10px] font-bold">Upload a video and click the preview button to see it here</p>
                  </div>
                )}
              </div>

              {/* Character Count / Info Sidebar */}
              <div className="p-4 border-4 border-black bg-blue-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black text-xs uppercase mb-2">Publishing Tips</h4>
                <ul className="text-[10px] font-bold space-y-2 list-disc pl-4">
                  <li>Optimal video length: 15-60 seconds</li>
                  <li>Resolution: 1080x1920 (Vertical)</li>
                  <li>Ensure you have selected at least one connection</li>
                  <li>Double check your caption and privacy settings</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publishing Modal */}
      {(isUploading || isPosting) && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="bg-yellow-300 border-[4px] border-black p-8 max-w-md w-[90%] flex flex-col items-center text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
            <Loader2 className="w-16 h-16 animate-spin mb-6 text-black" strokeWidth={3} />
            <h2 className="text-2xl font-black uppercase mb-4 text-black text-center break-words w-full">Publishing Post...</h2>
            <div className="bg-white border-2 border-black p-4 text-left w-full uppercase">
              <p className="text-xs font-bold leading-tight mb-2">
                ⚠️ <span className="text-red-600">Do not close this window or navigate away.</span>
              </p>
              <p className="text-[10px] font-bold text-gray-700 leading-tight">
                After finishing publishing, it may take a few minutes for the content to process and be visible on your profile.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPostPage;

