import React from 'react'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/custom/navbar'

const PrivacyPolicy = () => {
  return (
    <>
      <main className="min-h-screen w-full">
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy for AutoPosting.My.ID</h1>
              <p className="text-muted-foreground">Last Updated: {new Date().toISOString().split('T')[0]}</p>
            </div>

            <div className="space-y-8">
              {/* Introduction */}
              <Card className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Thank you for using AutoPosting.My.ID ("we," "us," or "our"). This Privacy Policy outlines how we collect, use, and protect your personal and non-personal information when you use our website and services.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  By accessing or using AutoPosting.My.ID, you agree to the terms of this Privacy Policy. If you do not agree with the practices described in this policy, please do not use our services.
                </p>
              </Card>

              {/* Section 1 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">1.1 Personal Data</h3>
                <p className="text-muted-foreground mb-3">We collect the following personal information from you:</p>
                <ul className="space-y-2 ml-6">
                  <li className="text-muted-foreground">
                    <strong className="text-foreground">Name:</strong> We collect your name to personalize your experience and communicate with you effectively.
                  </li>
                  <li className="text-muted-foreground">
                    <strong className="text-foreground">Email:</strong> We collect your email address to send you important information regarding your account, updates, and communication.
                  </li>
                  <li className="text-muted-foreground">
                    <strong className="text-foreground">Payment Information:</strong> We collect payment details to process your orders securely.
                  </li>
                  <li className="text-muted-foreground">
                    <strong className="text-foreground">Social Media Authentication Access Keys:</strong> We collect these to enable cross-posting functionality to your social media accounts.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">1.2 Non-Personal Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use web cookies to collect non-personal information such as your IP address, browser type, device information, and browsing patterns. This information helps us to enhance your browsing experience, analyze trends, and improve our services.
                </p>
              </Card>

              {/* Section 2 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Purpose of Data Collection</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We collect and use your personal data for order processing and social media posting. This includes processing your orders, enabling cross-posting functionality, sending confirmations, providing customer support, and keeping you updated about the status of your account and posts.
                </p>
              </Card>

              {/* Section 3 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. TikTok API Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AutoPosting.My.ID uses TikTok API Services to enable cross-posting functionality to TikTok. By using our service to interact with TikTok, you are also subject to TikTok's Terms of Service and Privacy Policy.
                </p>
              </Card>

              {/* Section 4 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party Platform Privacy Policies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  As we integrate with various social media platforms, your data may also be subject to those platforms' privacy policies. For more information on how these platforms collect and process data, please refer to their respective privacy policies:
                </p>
                <ul className="space-y-2 ml-6 mt-3">
                  <li className="text-muted-foreground">
                    <strong className="text-foreground">TikTok:</strong> <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TikTok Privacy Policy</a>
                  </li>
                  <li className="text-muted-foreground text-sm">
                    (Additional platform privacy policies will be added as we integrate more platforms)
                  </li>
                </ul>
              </Card>

              {/* Section 5 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not share your personal data with any other parties except as required for order processing and social media posting functionality. This may include sharing necessary data with the social media platforms you choose to post to, including TikTok through the TikTok API Services.
                </p>
              </Card>

              {/* Section 6 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AutoPosting.My.ID is not intended for children, and we do not collect any data from children.
                </p>
              </Card>

              {/* Section 7 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Updates to the Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. Users will be notified of any changes via email.
                </p>
              </Card>

              {/* Section 8 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  If you have any questions, concerns, or requests related to this Privacy Policy, you can contact us at:
                </p>
                
                <p className="text-foreground">
                  <strong>Email:</strong> <a href="mailto:admin@autoposting.my.id" className="text-primary hover:underline">admin@autoposting.my.id</a>
                </p>
              </Card>

              {/* Section 9 */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Data Protection Mechanisms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We take the protection of your sensitive data seriously and have implemented the following security measures:
                </p>
                <div className="ml-6 mb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">a) Encryption:</strong> Your Api Key keys and authentication tokens are encrypted using industry-standard encryption protocols both in transit and at rest.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  While we implement these security measures to protect your sensitive information, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure. We strive to use any acceptable means to protect your personal information, but we cannot guarantee its absolute security.
                </p>
              </Card>

              {/* Consent */}
              <Card className="p-6 bg-muted/30">
                <p className="text-muted-foreground leading-relaxed text-center">
                  By using AutoPosting.My.ID, you consent to the terms of this Privacy Policy.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default PrivacyPolicy