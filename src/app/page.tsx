import Navbar from "@/components/custom/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFE66D] w-full">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-8">
          {/* Beta Badge */}
          <div className="inline-block">
            <span className="px-4 py-2 bg-[#A6FAFF] border-2 border-black font-bold text-sm uppercase">
              🚀 Currently in Beta
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight">
            Post Your Social Media<br />
            Content With{" "}
            <span className="bg-[#FF6B6B] px-4 py-2 inline-block border-2 border-black">
              Simple APIs
            </span>
          </h2>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl font-medium max-w-2xl mx-auto">
            Automate your TikTok posting workflow with our powerful API.
            More platforms coming soon!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" rounded="full" className="w-full sm:w-auto min-w-[200px]">
              Get Started
            </Button>
          
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl sm:text-4xl font-black text-center mb-12">
          Why Choose AutoPosting?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="bg-[#B4F8C8]">
            <div className="text-5xl mb-4">⚡</div>
            <CardTitle>Simple APIs</CardTitle>
            <CardDescription>
              Some social media APIs are complex and require a lot of code to implement.
              <span className="bg-[#FF6B6B] px-4 py-2 inline-block border-2 border-black ml-1">AutoPosting.my.id</span> provides simple APIs that make it easy to post to social media.
            </CardDescription>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-[#A6FAFF]">
            <div className="text-5xl mb-4">🔒</div>
            <CardTitle>Multi-Platform</CardTitle>
            <CardDescription>
              Currently supporting TikTok with more platforms in development. We are working hard to make it the simplest APIs for all social media platforms.
            </CardDescription>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-[#FFB6C1]">
            <div className="text-5xl mb-4">📱</div>
            <CardTitle>Affordable & Simple Pricing</CardTitle>
            <CardDescription>
              Our API services are priced affordably and straightforwardly. While some providers impose high fees for unnecessary features, we keep it simple.
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* Platform Status Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border-4 border-black p-8 sm:p-12">
          <h3 className="text-3xl sm:text-4xl font-black mb-8 text-center">
            Platform Support
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TikTok - Active */}
            <div className="border-2 border-black p-6 bg-[#B4F8C8]">
              <div className="text-4xl mb-3">✅</div>
              <h4 className="text-xl font-black mb-2">TikTok</h4>
              <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold border border-black">
                ACTIVE
              </span>
            </div>

            {/* Coming Soon Platforms */}
            <div className="border-2 border-black p-6 bg-gray-200 opacity-60">
              <div className="text-4xl mb-3">⏳</div>
              <h4 className="text-xl font-black mb-2">Instagram</h4>
              <span className="inline-block px-3 py-1 bg-gray-400 text-white text-xs font-bold border border-black">
                COMING SOON
              </span>
            </div>

            <div className="border-2 border-black p-6 bg-gray-200 opacity-60">
              <div className="text-4xl mb-3">⏳</div>
              <h4 className="text-xl font-black mb-2">Twitter/X</h4>
              <span className="inline-block px-3 py-1 bg-gray-400 text-white text-xs font-bold border border-black">
                COMING SOON
              </span>
            </div>

            <div className="border-2 border-black p-6 bg-gray-200 opacity-60">
              <div className="text-4xl mb-3">⏳</div>
              <h4 className="text-xl font-black mb-2">YouTube</h4>
              <span className="inline-block px-3 py-1 bg-gray-400 text-white text-xs font-bold border border-black">
                COMING SOON
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-[#FF6B6B] border-4 border-black p-12 sm:p-16 text-center">
          <h3 className="text-3xl sm:text-5xl font-black mb-6">
            Ready to Automate Your Posting?
          </h3>
          <p className="text-xl sm:text-2xl mb-8 font-medium">
            Join the beta and start posting to TikTok via API today!
          </p>
          <Button size="lg" rounded="full" variant="outline" className="bg-white min-w-[250px]">
            Get API Access
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-bold">{`© ${new Date().getFullYear()} autoposting.my.id`}</p>
            <div className="flex gap-6">
              <Link href="/tos" className="font-bold hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="font-bold hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
