import { Config } from "@/constants/config";
import { NextResponse } from "next/server";

const CLIENT_KEY = Config.TIKTOK_CLIENT_KEY!;
const REDIRECT_URI = Config.TIKTOK_REDIRECT_URI!; // e.g. "https://yourdomain.com/api/tiktok/callback"

export async function GET() {
  // Generate csrfState
  const csrfState = Math.random().toString(36).substring(2);

  // Build TikTok auth URL
  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", CLIENT_KEY);
  url.searchParams.set("scope", "user.info.basic,video.publish,video.upload");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("state", csrfState);

  // Redirect and set cookie at the same time
  const res = NextResponse.redirect(url.toString());
  res.cookies.set({
    name: "csrfState",
    value: csrfState,
    maxAge: 60, // 1 min
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res;
}
