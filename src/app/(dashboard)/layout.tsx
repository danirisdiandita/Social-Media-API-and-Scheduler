

"use client";

import { AppSidebar } from "@/components/app-sidebar";
import LoadingPage from "@/components/custom/loading-page";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === "loading") {
        return <LoadingPage />;
    }

    if (status === 'unauthenticated') {
        return <LoadingPage />;
    }

    if (status === 'authenticated') {
        return (
            <>
                <AppSidebar />
                {children}
            </>
        );
    }

    return <LoadingPage />;
}
