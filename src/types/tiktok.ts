export enum TiktokPrivacyLevel {
    PUBLIC_TO_EVERYONE = "PUBLIC_TO_EVERYONE",
    MUTUAL_FOLLOW_FRIENDS = "MUTUAL_FOLLOW_FRIENDS",
    SELF_ONLY = "SELF_ONLY",
    FOLLOWER_OF_CREATOR = "FOLLOWER_OF_CREATOR"
}

export interface TiktokCreatorInfo {
    creator_avatar_url: string;
    creator_nickname: string;
    creator_username: string;
    privacy_level_options: TiktokPrivacyLevel[];
    comment_disabled: boolean;
    duet_disabled: boolean;
    stitch_disabled: boolean;
    max_video_post_duration_sec: number;
}

export enum TiktokPrivacyErrorCode {
    OK = "ok",
    SPAM_RISK_TOO_MANY_POSTS = "spam_risk_too_many_posts",
    SPAM_RISK_USER_BANNED_FROM_POSTING = "spam_risk_user_banned_from_posting",
    REACHED_ACTIVE_USER_CAP = "reached_active_user_cap",
    ACCESS_TOKEN_INVALID = "access_token_invalid",
    SCOPE_NOT_AUTHORIZED = "scope_not_authorized",
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
}

export interface TiktokCreatorInfoResponse {
    data: TiktokCreatorInfo;
    error: {
        code: TiktokPrivacyErrorCode;
        message: string;
        log_id: string;
    };
}