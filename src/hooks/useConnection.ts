import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = ([url, page, limit, search]: [string, number, number, string]) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set("search", search);
    return fetch(`${url}?${params}`).then((res) => res.json());
};

export const useConnection = (defaultPage: number = 1, defaultLimit: number = 10) => {
    const [page, setPage] = useState(defaultPage)
    const [limit, setLimit] = useState(defaultLimit)
    const [search, setSearch] = useState("")
    const { data, error, isLoading, mutate } = useSWR(['/api/connection', page, limit, search], fetcher);

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }
    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1)
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

    const handleDeleteConnectionById = async (id: string) => {
        try {
            const response = await fetch(`/api/connection/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                toast.error("Failed to delete connection", {
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
            toast.success("Successfully deleted connection", {
                position: "top-center",
            })
            mutate()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    position: "top-center",
                })
            }
        }
    }
    return { data, error, isLoading, handlePageChange, handleLimitChange, nextPage, prevPage, isDisabledNext, isDisabledPrev, handleDeleteConnectionById, mutate, search, setSearch };
}

