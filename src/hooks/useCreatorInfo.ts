import useSWRMutation from "swr/mutation";
import { toast } from "sonner";

export const SPAM_RISK_CODES = [
    'spam_risk_too_many_posts',
    'spam_risk_user_banned_from_posting',
    'reached_active_user_cap'
];

async function sendRequest(url: string, { arg }: { arg: { connectionId: string } }) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
    });

    const data = await response.json();

    if (!response.ok) {
        // CASE 3: non 200 status code, shows the error.message as it is
        throw new Error(data.error?.message || data.message || "Failed to fetch creator info");
    }

    return data;
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
            onSuccess: (data) => {
                const errorCode = data?.error?.code;

                if (errorCode && SPAM_RISK_CODES.includes(errorCode)) {
                    // CASE 2: status_code 200 but error.code is spam risk/cap
                    toast.warning(data.error.message || "Posting is currently disabled for this account.", {
                        position: "top-center",
                        duration: 6000,
                    });
                } else {
                    // CASE 1: status_code 200 and error.code === 'ok'
                    toast.success("Please choose Privacy level of your platform's post", {
                        position: "top-center",
                    });
                }
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

