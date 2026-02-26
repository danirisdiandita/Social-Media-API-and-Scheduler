import useSWRMutation from "swr/mutation";
import { toast } from "sonner";

async function sendRequest(url: string, { arg }: { arg: { connectionId: string } }) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch creator info");
    }

    return response.json();
}

export const useCreatorInfo = () => {
    const { trigger, data, error, isMutating } = useSWRMutation(
        "/api/connection/info",
        sendRequest,
        {
            onError: (err) => {
                toast.error(err.message || "Failed to load creator information", {
                    position: "top-center",
                });
            },
            onSuccess: () => {
                toast.success("Please choose Privacy level of your platform's post", {
                    position: "top-center",
                });
            },
        }
    );

    return {
        getCreatorInfo: trigger,
        creatorInfo: data,
        error,
        isLoading: isMutating,
    };
};
