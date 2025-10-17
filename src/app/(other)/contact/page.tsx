import Navbar from '@/components/custom/navbar'
import React from 'react'

const ContactPage = () => {
  return (
    <>
      <main className="min-h-screen w-full">
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-muted-foreground">Get in touch with the AutoPosting.My.ID team</p>
            </div>

            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-2xl font-bold text-foreground mb-4">AutoPosting.My.ID</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Have questions or need assistance? We'd love to hear from you.
                </p>
                <div className="space-y-2">
                  <p className="text-foreground">
                    <strong>Company:</strong> AutoPosting.My.ID
                  </p>
                  <p className="text-foreground">
                    <strong>Email:</strong>{' '}
                    <a 
                      href="mailto:admin@autoposting.my.id" 
                      className="text-primary hover:underline"
                    >
                      admin@autoposting.my.id
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