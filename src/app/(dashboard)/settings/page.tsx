"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function SettingsPage() {
    const { data: session } = useSession()
    const [hasPassword, setHasPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetch("/api/auth/password")
            .then((res) => res.json())
            .then((data) => {
                if (data.hasPassword !== undefined) {
                    setHasPassword(data.hasPassword)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setSubmitting(true)

        try {
            const body: { currentPassword?: string; newPassword: string } = { newPassword }
            if (hasPassword) {
                body.currentPassword = currentPassword
            }

            const res = await fetch("/api/auth/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Failed to update password")
            } else {
                toast.success(hasPassword ? "Password updated" : "Password set")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
                if (!hasPassword) setHasPassword(true)
            }
        } catch {
            setError("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return null

    return (
        <div className="flex-1 p-6">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-black mb-6">Settings</h1>

                <Card className="border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6">
                    <h2 className="text-xl font-black mb-4">
                        {hasPassword ? "Change Password" : "Set Password"}
                    </h2>

                    {!hasPassword && (
                        <p className="text-sm text-gray-600 mb-4">
                            You signed up with Google. Set a password to also sign in with email.
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {hasPassword && (
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    required
                                    className="border-2 border-black rounded-none h-12"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                required
                                minLength={6}
                                className="border-2 border-black rounded-none h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
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
                            disabled={submitting}
                            className="cursor-pointer w-full h-12 bg-[#FFE66D] hover:bg-[#FFD700] text-black font-bold text-base border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            size="lg"
                            rounded="none"
                        >
                            {submitting
                                ? "Saving..."
                                : hasPassword
                                    ? "Change Password"
                                    : "Set Password"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}
