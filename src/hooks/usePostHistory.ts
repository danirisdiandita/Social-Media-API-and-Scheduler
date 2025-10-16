import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = ([url, page, limit]: [string, number, number]) =>
    fetch(`${url}?page=${page}&limit=${limit}`).then((res) => res.json());

export const usePostHistory = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const { data, error, isLoading, mutate } = useSWR(['/api/post-history', page, limit], fetcher);

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }
    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1) // Reset to first page when changing limit
    }

    const nextPage = () => {
        if (data?.totalPages && page < data.totalPages) {
            setPage(page + 1)
        }
    }
    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const isDisabledNext = !data?.totalPages || page >= data.totalPages
    const isDisabledPrev = page <= 1

    const handleDeletePostById = async (id: string) => {
        try {
            const response = await fetch(`/api/post-history/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                toast.error("Failed to delete post history", {
                    position: "top-center",
                })
                return
            }
            const data = await response.json()
            if (data.error) {
                toast.error(data.error, {
                    position: "top-center",
                })
                return
            }
            toast.success("Successfully deleted post history", {
                position: "top-center",
            })
            // Refetch the data after successful deletion
            mutate()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    position: "top-center",
                })
            }
        }
    }
    
    return { data, error, isLoading, handlePageChange, handleLimitChange, nextPage, prevPage, isDisabledNext, isDisabledPrev, handleDeletePostById, mutate };
}
