'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const StartButton = () => {
    const { status } = useSession()
    const router = useRouter()
    const handleSignIn = () => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else {
            router.push('/dashboard')
        }
    }
    if (status === 'loading') {
        return <Button disabled className="cursor-not-allowed">Loading...</Button>
    }

    return (
        <Button variant="outline" onClick={handleSignIn} size="sm" className="cursor-pointer">
            {status === 'authenticated' ? 'Dashboard' : 'Sign In'}
        </Button>
    )
}

export default StartButton