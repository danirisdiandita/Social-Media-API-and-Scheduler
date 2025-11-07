import { useState } from 'react'
import { toast } from 'sonner'

export const useUploadVideo = () => {
    const [isUploading, setIsUploading] = useState(false)

    const uploadVideos = async (files: File[]) => {
        setIsUploading(true)
        
        try {
            // Step 1: Get presigned URLs from the API
            const filesMetadata = files.map(file => ({
                name: file.name,
                type: file.type
            }))

            const presignedResponse = await fetch('/api/file/ondashboard/video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ files: filesMetadata }),
            })
            
            if (!presignedResponse.ok) {
                const error = await presignedResponse.json()
                throw new Error(error.error || 'Failed to get upload URLs')
            }
            
            const presignedUrls: Record<string, { uploadUrl: string; fileName: string }> = await presignedResponse.json()
            
            // Step 2: Upload each file directly to S3 using presigned URLs
            const fileMapping: Record<string, string> = {}
            
            for (const file of files) {
                const { uploadUrl, fileName } = presignedUrls[file.name]
                
                const uploadResponse = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                    },
                })
                
                if (!uploadResponse.ok) {
                    throw new Error(`Failed to upload ${file.name}`)
                }
                
                // Map original filename to S3 key
                fileMapping[file.name] = fileName
            }
            
            toast.success('Videos uploaded successfully', {
                duration: 5000,
                position: "top-center",
            })
            
            return fileMapping
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload videos'
            toast.error(errorMessage, {
                duration: 5000,
                position: "top-center",
            })
            throw error
        } finally {
            setIsUploading(false)
        }
    }

    return {
        uploadVideos,
        isUploading,
    }
}
