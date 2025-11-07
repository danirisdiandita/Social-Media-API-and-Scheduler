import { useState } from 'react'
import { toast } from 'sonner'


export const useUploadFile = () => {
    const [isUploading, setIsUploading] = useState(false)

    const uploadFiles = async (files: File[], useOriginalFilename = false) => {
        setIsUploading(true)
        
        try {
            const formData = new FormData()
            
            // Add all files to formData
            files.forEach((file) => {
                formData.append('files', file)
            })
            
            // Add useOriginalFilename parameter if needed
            if (useOriginalFilename) {
                formData.append('useOriginalFilename', 'true')
            }
            
            const response = await fetch('/api/file/ondashboard', {
                method: 'POST',
                body: formData,
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to upload files')
            }
            
            const fileMapping = await response.json()
            toast.success('Files uploaded successfully', {
                duration: 5000,
                position: "top-center",
            })
            return fileMapping
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload files'
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
        uploadFiles,
        isUploading,
    }
}
