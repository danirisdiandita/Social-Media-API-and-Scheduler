"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function RegisterForm() {
    const session = useSession()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    if (session.status === "authenticated") {
        redirect("/dashboard")
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, firstName, lastName }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Registration failed")
                return
            }

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Account created but sign in failed. Please try logging in.")
            } else {
                redirect("/dashboard")
            }
        } catch {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[#FFE66D]">
            <Card className="w-full max-w-md bg-white shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                {/* Header */}
                <div className="space-y-4 text-center p-8 border-b-4 border-black">
                    <div className="mx-auto w-fit flex items-center gap-3 mb-4">
                        <Image src="/autoposting.svg" alt="Logo" width={50} height={50} />
                        <h1 className="text-3xl font-black">AutoPosting.my.id</h1>
                    </div>
                    <h2 className="text-4xl font-black text-black">Create Account</h2>
                    <p className="text-lg font-medium text-black">
                        Sign up to get started
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    required
                                    className="border-2 border-black rounded-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    required
                                    className="border-2 border-black rounded-none h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="border-2 border-black rounded-none h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                required
                                minLength={6}
                                className="border-2 border-black rounded-none h-12"
                            />
                        </div>

                        {error && (
                            <p className="text-red-600 font-bold text-sm">{error}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer w-full h-14 bg-[#FFE66D] hover:bg-[#FFD700] text-black font-bold text-base border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            size="lg"
                            rounded="none"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-black" />
                        <span className="text-sm font-bold text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-black" />
                    </div>

                    {/* Google Button */}
                    <Button
                        onClick={() => signIn("google", { redirectTo: "/dashboard" })}
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
                    <p className="text-xs text-center font-medium text-black">
                        Already have an account?{" "}
                        <Link href="/login" className="font-black underline hover:text-[#00E1EF] transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    )
}
