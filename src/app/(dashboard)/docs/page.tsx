"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Code, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ApiDocumentation from '@/components/custom/dashboard/documentation/api-documentation'
import GettingStartedDocs from '@/components/custom/dashboard/documentation/getting-started-doc'

const DocsPage = () => {
  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto bg-[#B9F8FE]">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Documentation</h1>
          <p className="text-lg">
            Everything you need to integrate AutoPosting API into your applications
          </p>
        </div>

        <Card className="mb-8 bg-[#FFE66D]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white  border-black flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <CardTitle>Your API Access</CardTitle>
                <CardDescription className="text-black font-medium">Quick access to your API credentials and settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link href="/api-keys">
                <Button className="gap-2 cursor-pointer bg-white  border-black font-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                  View API Keys
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/connections">
                <Button className="gap-2 cursor-pointer bg-white  border-black font-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                  Manage Connections
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList>
            <TabsTrigger value="getting-started" className="gap-2 cursor-pointer">
              <Zap className="w-4 h-4" />
              Getting Started
            </TabsTrigger>
            <TabsTrigger value="api-docs" className="gap-2 cursor-pointer">
              <Code className="w-4 h-4" />
              API Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-6 mt-6">
            <GettingStartedDocs />
          </TabsContent>

          <TabsContent value="api-docs" className="space-y-6 mt-6">
            <ApiDocumentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DocsPage