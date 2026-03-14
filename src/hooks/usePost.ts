import { useState } from "react"

export const usePost = () => {
    const [isPosting, setIsPosting] = useState(false)
    const doPosting = async (postData: {
        title: string,
        caption: string,
        connections: string[],
        privacy: string,
        media_type: string,
        media_ids: string[],
        disable_comment?: boolean,
        disable_duet?: boolean,
        disable_stitch?: boolean,
        brand_content_toggle?: boolean,
        brand_organic_toggle?: boolean,
    }) => {
        setIsPosting(true)
        try {
            const response = await fetch('/api/posts/ondashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || 'Failed to create post')
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error creating post:', error)
            throw error
        } finally {
            setIsPosting(false)
        }
    }

    return {
        doPosting,
        isPosting
    }
}
