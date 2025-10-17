import React from 'react'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Navbar from '@/components/custom/navbar'

const TermsOfService = () => {
  return (
    <>
      <main className="min-h-screen w-full">
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Terms and Conditions for AutoPosting.My.ID</h1>
              <p className="text-muted-foreground">Last Updated: {new Date().toISOString().split('T')[0]}</p>
            </div>

            <div className="space-y-8">
              {/* Introduction */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to AutoPosting.My.ID!</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") govern your use of the AutoPosting.My.ID website and the services provided by AutoPosting.My.ID. By using our Website and services, you agree to these Terms.
                </p>
              </Card>

              {/* Section 1 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Description of AutoPosting.My.ID</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AutoPosting.My.ID is a unified API platform that allows users to cross-post and upload content to multiple social media platforms from one place. Our service simplifies social media integration for developers and businesses.
                </p>
              </Card>

              {/* Section 2 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Third-Party Platform Terms of Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  By using AutoPosting.My.ID to interact with third-party social media platforms, you also agree to be bound by their respective Terms of Service. This includes:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="text-muted-foreground">
                    <strong className="text-foreground">TikTok:</strong> <a href="https://www.tiktok.com/legal/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TikTok Terms of Service</a>
                  </li>
                  <li className="text-muted-foreground text-sm">
                    (Additional platform terms will be added as we integrate more platforms)
                  </li>
                </ul>
              </Card>

              {/* Section 3 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. User Data and Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We collect and store user data, including name, email, payment information, and social media authentication access keys, as necessary to provide our services. For details on how we handle your data, please refer to our{' '}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </Card>

              {/* Section 4 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Non-Personal Data Collection</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use web cookies to collect non-personal data for the purpose of improving our services and user experience.
                </p>
              </Card>

              {/* Section 5 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Ownership and Usage Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you use AutoPosting.My.ID, you can sign in to your social media accounts and authorize access to your data to post to the platforms connected to the AutoPosting.My.ID service. You retain full ownership of your content, but grant us the necessary rights to post on your behalf to the platforms you authorize.
                </p>
              </Card>

              {/* Section 6 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Beta Testing and Pricing</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  AutoPosting.My.ID is currently in beta testing and is offered free of charge. During this period:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="text-muted-foreground">
                    All features are available at no cost
                  </li>
                  <li className="text-muted-foreground">
                    We will provide at least 30 days notice before introducing any paid plans
                  </li>
                  <li className="text-muted-foreground">
                    Beta users will receive special early adopter benefits
                  </li>
                </ul>
              </Card>

              {/* Section 7 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Refund Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once paid plans are introduced, we will offer a full refund within 24 hours after the purchase. To request a refund, please contact us at{' '}
                  <a href="mailto:admin@autoposting.my.id" className="text-primary hover:underline">admin@autoposting.my.id</a>.
                </p>
              </Card>

              {/* Section 8 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AutoPosting.My.ID is not intended for use by children, and we do not knowingly collect any data from children.
                </p>
              </Card>

              {/* Section 9 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Updates to the Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these Terms from time to time. Users will be notified of any changes via email.
                </p>
              </Card>

              {/* Section 10 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms are governed by the laws of Indonesia.
                </p>
              </Card>

              {/* Section 11 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  For any questions or concerns regarding these Terms of Service, please contact us at:
                </p>
                <p className="text-foreground">
                  <strong>Email:</strong> <a href="mailto:admin@autoposting.my.id" className="text-primary hover:underline">admin@autoposting.my.id</a>
                </p>
              </Card>

              {/* Thank You */}
              <Card className="p-6 bg-muted/30">
                <p className="text-muted-foreground leading-relaxed text-center font-semibold">
                  Thank you for using AutoPosting.My.ID!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default TermsOfService