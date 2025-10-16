import React from 'react'
import DashboardNavbar from '@/components/custom/dashboard-navbar'
import { Card } from '@/components/ui/card'
import { Check, Clock } from 'lucide-react'
import Image from 'next/image'

const PlatformsPage = () => {
  const platforms = [
    {
      name: 'TikTok',
      icon: '/TikTok_Icon_Black_Circle.png',
      status: 'available',
      description: 'Post videos with captions and hashtags',
      features: ['Video upload', 'Caption support', 'Hashtag support', 'Privacy settings']
    },
    {
      name: 'Instagram',
      icon: null,
      status: 'coming-soon',
      description: 'Share photos, videos, stories, and reels',
      features: ['Feed posts', 'Stories', 'Reels', 'Carousel posts']
    },
    {
      name: 'Twitter/X',
      icon: null,
      status: 'coming-soon',
      description: 'Post tweets with media attachments',
      features: ['Text posts', 'Image uploads', 'Video uploads', 'Thread support']
    },
    {
      name: 'Facebook',
      icon: null,
      status: 'coming-soon',
      description: 'Share content to pages and profiles',
      features: ['Page posts', 'Photo albums', 'Video posts', 'Link sharing']
    },
    {
      name: 'LinkedIn',
      icon: null,
      status: 'coming-soon',
      description: 'Professional content sharing',
      features: ['Text posts', 'Article sharing', 'Media uploads', 'Company pages']
    },
    {
      name: 'YouTube',
      icon: null,
      status: 'coming-soon',
      description: 'Upload and manage video content',
      features: ['Video upload', 'Playlist management', 'Shorts', 'Community posts']
    }
  ]

  return (
    <>
      <main className="min-h-screen w-full">
        <DashboardNavbar />
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Supported Platforms
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect and post to multiple social media platforms through our unified API
              </p>
            </div>

            {/* Platforms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform, index) => (
                <Card 
                  key={index} 
                  className={`p-6 relative ${
                    platform.status === 'available' 
                      ? 'border-2 border-primary/50 shadow-lg' 
                      : 'opacity-75'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {platform.status === 'available' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-semibold text-green-600">Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground">Coming Soon</span>
                      </div>
                    )}
                  </div>

                  {/* Platform Icon & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      {platform.icon ? (
                        <Image 
                          src={platform.icon} 
                          alt={`${platform.name} Icon`} 
                          className="w-12 h-12" 
                          width={48} 
                          height={48} 
                        />
                      ) : (
                        <span className="text-2xl font-bold text-muted-foreground">
                          {platform.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mt-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Features:</h4>
                    {platform.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Available Glow Effect */}
                  {platform.status === 'available' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none rounded-lg" />
                  )}
                </Card>
              ))}
            </div>

            {/* Info Section */}
            <div className="mt-16 max-w-3xl mx-auto">
              <Card className="p-8 bg-muted/30">
                <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                  More Platforms Coming Soon
                </h2>
                <p className="text-muted-foreground text-center leading-relaxed mb-6">
                  We're actively working on integrating more social media platforms. 
                  As a beta user, you'll get early access to new platforms as they become available.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">1</div>
                    <div className="text-sm text-muted-foreground">Platform Available</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-border" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">5+</div>
                    <div className="text-sm text-muted-foreground">In Development</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-border" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">∞</div>
                    <div className="text-sm text-muted-foreground">Possibilities</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default PlatformsPage