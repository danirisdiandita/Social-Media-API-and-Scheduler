"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function GoogleLoginForm() {
    const session = useSession()
    if (session.status === "authenticated") {
        redirect("/dashboard")
    }
    const handleGoogleSignIn = () => {
        signIn("google", { redirectTo: "/dashboard" })
    }
    return (
        <div className="mx-auto min-h-screen flex items-center justify-center p-4 bg-[#FFE66D]">
            <Card className="w-full max-w-md bg-white shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                {/* Header */}
                <div className="space-y-4 text-center p-8 border-b-4 border-black">
                    <div className="mx-auto w-fit flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-[#A6FAFF] border-4 border-black flex items-center justify-center">
                            <div className="w-10 h-10 bg-[#79F7FF] border-2 border-black transform rotate-45"></div>
                        </div>
                        <h1 className="text-3xl font-black">AutoPost.my.id</h1>
                    </div>
                    <h2 className="text-4xl font-black text-black">Welcome Back!</h2>
                    <p className="text-lg font-medium text-black">
                        Sign in with your Google account to continue
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <Button
                        onClick={handleGoogleSignIn}
                        className="cursor-pointer w-full h-14 bg-white hover:bg-gray-50 text-black font-bold text-base border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
                        size="lg"
                        rounded="none"
                    >
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    {/* Beta Badge */}
                    <div className="bg-[#A6FAFF] border-2 border-black p-4 text-center">
                        <p className="font-bold text-sm uppercase">🚀 Currently in Beta - Free Access!</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 pt-0 space-y-4">
                    <div className="w-full h-1 bg-black" />
                    <p className="text-xs text-center font-medium text-black leading-relaxed">
                        By continuing, you agree to our{" "}
                        <Link href="/tos" className="font-black underline hover:text-[#00E1EF] transition-colors">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="font-black underline hover:text-[#00E1EF] transition-colors">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    )
}
