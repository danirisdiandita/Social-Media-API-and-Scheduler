"use client"

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { FileText, Link2, Key, BookOpen, Image as ImageIcon, Video as VideoIcon } from 'lucide-react'

interface PortalCard {
  title: string
  description: string
  url: string
  icon: React.ElementType
  color: string
}

const portalCards: PortalCard[] = [
  {
    title: "Posts",
    description: "Create and manage your posts",
    url: "/posts",
    icon: ImageIcon,
    color: "bg-[#A0E7E5]",
  },
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
    <div className="p-4 md:p-8 bg-[#B9F8FE]">
      <div className="mb-8 px-2 md:px-0">
        <h1 className="text-4xl font-black mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Choose where you want to go</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {portalCards.map((card) => (
          <Link key={card.title} href={card.url} className="block">
            <Card className="cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all h-full p-4 md:p-8">
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                <div className={`w-12 h-12 md:w-16 md:h-16 ${card.color} border-4 border-black shrink-0 flex items-center justify-center md:mb-4`}>
                  <card.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-2xl font-black mb-1 md:mb-3">{card.title}</h3>
                  <p className="text-sm md:text-lg text-gray-500">{card.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage