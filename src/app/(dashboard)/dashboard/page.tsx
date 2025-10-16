"use client"

import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Rocket, FileText, Link2, Key, BookOpen } from 'lucide-react'

interface PortalCard {
  title: string
  description: string
  url: string
  icon: React.ElementType
  color: string
}

const portalCards: PortalCard[] = [
  {
    title: "Post History",
    description: "View and manage all your scheduled and published posts",
    url: "/post-history",
    icon: FileText,
    color: "bg-[#A0E7E5]",
  },
  {
    title: "Connections",
    description: "Connect and manage your social media accounts",
    url: "/connections",
    icon: Link2,
    color: "bg-[#FFAAA5]",
  },
  {
    title: "API Keys",
    description: "Generate and manage API keys for programmatic access",
    url: "/api-keys",
    icon: Key,
    color: "bg-[#B4F8C8]",
  },
  {
    title: "Documentation",
    description: "Read comprehensive guides and API documentation",
    url: "/docs",
    icon: BookOpen,
    color: "bg-[#FBE7C6]",
  },
]

const DashboardPage = () => {
  return (
    <div className="p-8 bg-[#B9F8FE]">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Choose where you want to go</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portalCards.map((card) => (
          <Link key={card.title} href={card.url} className="block">
            <Card className="cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all h-full">
              <CardHeader>
                <div className={`w-16 h-16 ${card.color} border-4 border-black flex items-center justify-center mb-4`}>
                  <card.icon className="w-8 h-8" />
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage