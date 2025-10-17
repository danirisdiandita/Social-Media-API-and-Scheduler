import React from 'react'
import { Card } from '@/components/ui/card'
import { Target, Users, Zap, Globe } from 'lucide-react'
import Navbar from '@/components/custom/navbar'

const AboutPage = () => {
  return (
    <>
      <main className="min-h-screen w-full">
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                About AutoPosting.My.ID
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Simplifying social media integration for developers and businesses worldwide
              </p>
            </div>

            {/* Company Info */}
            

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
              <Card className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To simplify social media integration by providing developers with a unified, 
                  reliable, and easy-to-use API that eliminates the complexity of managing 
                  multiple platform integrations.
                </p>
              </Card>

              <Card className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading social media API platform that empowers businesses 
                  of all sizes to efficiently manage their social media presence and reach 
                  their audience across all major platforms.
                </p>
              </Card>
            </div>

            {/* What We Do */}
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-foreground text-center mb-8">What We Do</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Unified API</h4>
                      <p className="text-sm text-muted-foreground">
                        One API to connect with multiple social media platforms, saving development time and resources.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Developer-First</h4>
                      <p className="text-sm text-muted-foreground">
                        Built by developers, for developers. Clean documentation and intuitive design.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Reliable Infrastructure</h4>
                      <p className="text-sm text-muted-foreground">
                        Built on robust infrastructure to ensure your content reaches your audience every time.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Global Reach</h4>
                      <p className="text-sm text-muted-foreground">
                        Connect with audiences worldwide through all major social media platforms.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Beta Notice */}
            <div className="max-w-3xl mx-auto">
              <Card className="p-8 bg-muted/30 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Join Our Beta</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We're currently in beta testing and actively improving our platform. 
                  Your feedback is invaluable in helping us build the best social media API solution.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-primary">Currently Free During Beta</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default AboutPage