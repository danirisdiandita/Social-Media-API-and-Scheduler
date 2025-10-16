import DashboardNavbar from '@/components/custom/dashboard-navbar'
import React from 'react'

const ContactPage = () => {
  return (
    <>
      <main className="min-h-screen w-full">
        <DashboardNavbar />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-muted-foreground">Get in touch with the Widya Social team</p>
            </div>

            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Widya Wicara</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Have questions or need assistance? We'd love to hear from you.
                </p>
                <div className="space-y-2">
                  <p className="text-foreground">
                    <strong>Company:</strong> Widya Wicara (PT. Widya Informasi Nusantara)
                  </p>
                  <p className="text-foreground">
                    <strong>Email:</strong>{' '}
                    <a 
                      href="mailto:dani@widyawicara.com" 
                      className="text-primary hover:underline"
                    >
                      dani@widyawicara.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ContactPage