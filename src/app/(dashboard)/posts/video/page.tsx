'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Calendar as CalendarIcon, Clock, Send, Video as VideoIcon, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useConnection } from '@/hooks/useConnection'
import { Config } from '@/constants/config'
import { useUploadVideo } from '@/hooks/useUploadVideo'
import { usePost } from '@/hooks/usePost'
import { toast } from 'sonner'

// Mock social media connections
const mockConnections = [
  { id: '1', name: 'Facebook', icon: '📘', connected: true },
  { id: '2', name: 'Twitter', icon: '🐦', connected: true },
  { id: '3', name: 'Instagram', icon: '📷', connected: true },
  { id: '4', name: 'LinkedIn', icon: '💼', connected: true },
]

const VideoPostPage = () => {
  const [videos, setVideos] = useState<File[]>([])
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
    setVideos(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    multiple: true
  })

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index))
  }

  const toggleConnection = (id: string) => {
    setSelectedConnections(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
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
      videos: videos.map(vid => ({ name: vid.name, size: vid.size })),
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

    // uploading videos 
    const fileMapping = await uploadVideos(videos)

    console.log("fileMapping", fileMapping)

    // get video ids of each video 
    const env_ = Config.NEXT_PUBLIC_ENV
    const videoIds = videos.map(vid => fileMapping[vid.name])
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
      media_type: 'VIDEO',
      media_ids: videoIds
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
    setCaption('')
    setSelectedConnections([])
    setPostSuccess(false)
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex items-center justify-between p-4 border-b-4 border-black">
        <div>
          <h1 className="text-2xl font-black">{postSuccess ? 'Post Successful!' : 'Create Video Post'}</h1>
          <p className="text-sm font-medium">
            {postSuccess ? 'Your video has been posted successfully' : 'Upload videos and share them with your connections'}
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Video Upload Section */}
            <div className="space-y-3">
              <Label className="text-base font-black uppercase">Upload Videos</Label>
              <div
                {...getRootProps()}
                className={`border-4 border-black p-8 text-center transition-all ${
                  isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                } ${isDragActive ? 'bg-purple-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
              >
                <input {...getInputProps()} disabled={isProcessing} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-black" strokeWidth={2.5} />
                {isDragActive ? (
                  <p className="font-black text-black">Drop the videos here...</p>
                ) : (
                  <div>
                    <p className="font-bold mb-1">Drag & drop videos here, or click to select</p>
                    <p className="text-sm font-medium">Supports: MP4, MOV, AVI, MKV, WEBM</p>
                  </div>
                )}
              </div>

              {/* Preview Videos */}
              {videos.length > 0 && (
                <div className="space-y-3 mt-4">
                  {videos.map((file, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex-shrink-0 w-16 h-16 bg-purple-300 border-2 border-black flex items-center justify-center">
                        <VideoIcon className="w-8 h-8 text-black" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{file.name}</p>
                        <p className="text-sm font-medium">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={() => removeVideo(index)}
                        disabled={isProcessing}
                        className="flex-shrink-0 p-2 bg-red-500 border-2 border-black hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </button>
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
                        } ${
                          selectedConnections.includes(connection.id)
                            ? 'bg-purple-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
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
              <div className="flex-1 space-y-3 p-4 border-4 border-black bg-purple-100">
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
                disabled={videos.length === 0 || selectedConnections.length === 0 || isProcessing}
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
  )
}

export default VideoPostPage

