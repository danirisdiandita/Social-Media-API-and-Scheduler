import { Card } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"
import DashboardNavbar from "@/components/custom/dashboard-navbar"

export default function PricingPage() {
    return (
        <>
            <main className="min-h-screen w-full">
                <DashboardNavbar />
                <div className="min-h-screen bg-background mx-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        {/* Header */}
                        <div className="text-center mb-16">
                            {/* Beta Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-primary">Currently in Beta Testing</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                                Simple, Transparent Pricing
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                We're currently in beta testing. All features are completely free while we perfect our platform.
                            </p>
                        </div>

                        {/* Pricing Card */}
                        <div className="max-w-lg mx-auto">
                            <Card className="p-8 border-2 border-primary/50 shadow-lg relative overflow-hidden">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                                <div className="relative">
                                    {/* Plan Header */}
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                                            Beta Access
                                        </div>
                                        <h2 className="text-3xl font-bold text-foreground mb-2">Free Forever</h2>
                                        <p className="text-muted-foreground">During beta testing period</p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center mb-8 pb-8 border-b border-border">
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-5xl font-bold text-foreground">$0</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">No credit card required</p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-4 mb-8">
                                        <h3 className="font-semibold text-foreground mb-4">What's included:</h3>
                                        {[
                                            "Unlimited API requests",
                                            "TikTok integration (more platforms coming soon)",
                                            "Media upload support (images & videos)",
                                            "Post scheduling",
                                            "API key management",
                                            "Email support",
                                            "Access to all beta features",
                                            "Priority feedback channel"
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 text-primary" />
                                                </div>
                                                <span className="text-sm text-foreground">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Link
                                        href="/auth/login"
                                        className="block w-full bg-primary hover:bg-primary/90 text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Get Started Free
                                    </Link>

                                    {/* Beta Notice */}
                                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground text-center leading-relaxed">
                                            <strong className="text-foreground">Beta Testing Notice:</strong> We're actively developing and improving our platform.
                                            Your feedback helps us build a better product. Pricing plans will be announced before we exit beta.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* FAQ Section */}
                        <div className="mt-20 max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-6">
                                <Card className="p-6">
                                    <h3 className="font-semibold text-foreground mb-2">How long will the beta be free?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We'll provide at least 30 days notice before introducing any paid plans. All beta users will receive special early adopter benefits.
                                    </p>
                                </Card>
                                <Card className="p-6">
                                    <h3 className="font-semibold text-foreground mb-2">What happens to my data after beta?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        All your data, API keys, and connections will be preserved. You'll have the option to continue with a paid plan or export your data.
                                    </p>
                                </Card>
                                <Card className="p-6">
                                    <h3 className="font-semibold text-foreground mb-2">Are there any usage limits during beta?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Currently, there are no hard limits. We may introduce fair usage policies if needed, but we'll communicate any changes well in advance.
                                    </p>
                                </Card>
                                <Card className="p-6">
                                    <h3 className="font-semibold text-foreground mb-2">Which platforms are supported?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Currently, we support TikTok. We're actively working on adding Instagram, Twitter, Facebook, LinkedIn, and YouTube integrations.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
