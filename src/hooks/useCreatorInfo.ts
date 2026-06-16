import useSWRMutation from "swr/mutation";
import { toast } from "sonner";

export interface RestrictionInfo {
    code: string;
    title: string;
    subtitle: string;
    severity: "warning" | "error" | "retry";
}

export const POSTING_RESTRICTION_CODES: Record<string, RestrictionInfo> = {
    spam_risk_too_many_posts: {
        code: "spam_risk_too_many_posts",
        title: "You've reached today's posting limit",
        subtitle: "You can post again tomorrow. Check back in 24 hours.",
        severity: "warning",
    },
    spam_risk_user_banned_from_posting: {
        code: "spam_risk_user_banned_from_posting",
        title: "Your account can't post right now",
        subtitle: "TikTok has restricted posting on your account. Contact TikTok support for help.",
        severity: "error",
    },
    reached_active_user_cap: {
        code: "reached_active_user_cap",
        title: "Service is busy — try again later",
        subtitle: "We've hit our daily publishing limit. Please try posting again in a few hours.",
        severity: "warning",
    },
    access_token_invalid: {
        code: "access_token_invalid",
        title: "Your TikTok session has expired",
        subtitle: "Please reconnect your TikTok account to continue posting.",
        severity: "error",
    },
    scope_not_authorized: {
        code: "scope_not_authorized",
        title: "Posting permission not granted",
        subtitle: "Please reconnect your TikTok account and allow posting access when prompted.",
        severity: "error",
    },
    rate_limit_exceeded: {
        code: "rate_limit_exceeded",
        title: "Too many requests — slow down",
        subtitle: "You're sending requests too quickly. Wait a moment and try again.",
        severity: "warning",
    },
    tiktok_server_error: {
        code: "tiktok_server_error",
        title: "TikTok is having issues right now",
        subtitle: "This is on TikTok's end, not yours. Please try again in a few minutes.",
        severity: "retry",
    },
};

export const SPAM_RISK_CODES = Object.keys(POSTING_RESTRICTION_CODES);

export type RestrictionCode = keyof typeof POSTING_RESTRICTION_CODES;

export function getRestrictionInfo(errorCode: string | undefined): RestrictionInfo | null {
    if (!errorCode) return null;
    return POSTING_RESTRICTION_CODES[errorCode] || null;
}

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
                const restriction = getRestrictionInfo(errorCode);

                if (restriction) {
                    toast.warning(restriction.title, {
                        description: restriction.subtitle,
                        position: "top-center",
                        duration: 8000,
                    });
                } else {
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

