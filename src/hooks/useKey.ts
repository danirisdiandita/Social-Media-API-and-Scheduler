import { toast } from "sonner"
import useSWRInfinite from "swr/infinite"
const fetcher = (url: string) => fetch(url).then(res => res.json())

export const useKey = (pageSize: number = 10) => {
    const getKey = (pageIndex: number, previousPageData: any) => {
        // Reached the end
        if (previousPageData && !previousPageData.data?.length) return null

        // First page, we don't have previousPageData
        if (pageIndex === 0) return `/api/apikey?page=0&limit=${pageSize}`

        // Add the cursor to the API endpoint
        return `/api/apikey?page=${pageIndex}&limit=${pageSize}`
    }

    const { data, error, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite(
        getKey,
        fetcher,
        {
            revalidateFirstPage: false,
            revalidateAll: false,
        }
    )

    const keys = data ? data.flatMap(page => page.data || []) : []
    const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
    const isEmpty = data?.[0]?.data?.length === 0
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data?.length < pageSize)


    const generateKey = async (name?: string) => {
        const res_ = await fetch("/api/apikey/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        })

        const res = await res_.json()
        if (res.error) {
            toast.error(res.error, {
                position: "top-center",
            })
            return
        }

        toast.success("API key generated successfully", {
            position: "top-center",
        })
        mutate()
    }

    const deleteKey = async (id: number) => {
        const res_ = await fetch(`/api/apikey/${id}`, {
            method: "DELETE",
        })

        const res = await res_.json()
        if (res.error) {
            toast.error(res.error, {
                position: "top-center",
            })
            return
        }

        toast.success("API key deleted successfully", {
            position: "top-center",
        })
        mutate()
    }

    return {
        keys,
        error,
        isLoading,
        isLoadingMore,
        isReachingEnd,
        size,
        setSize,
        mutate,
        isValidating,
        generateKey,
        deleteKey,
    }
}
