import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

const LITE_PLANS = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    credits: 10,
    features: ["10 credits", "Chat interface only", "1 concurrent generation", "Community access", "Basic models"],
  },
  {
    name: "Lite",
    price: 7,
    period: "month",
    credits: 150,
    popular: false,
    features: [
      "150 credits/month",
      "Chat interface only",
      "2 concurrent generations",
      "All basic models",
      "Priority support",
    ],
  },
  {
    name: "Lite Plus",
    price: 14,
    period: "month",
    credits: 300,
    features: [
      "300 credits/month",
      "Chat interface only",
      "3 concurrent generations",
      "All models",
      "Priority support",
      "Early access to features",
    ],
  },
]

const PRO_PLANS = [
  {
    name: "Pro",
    price: 29,
    period: "month",
    credits: 600,
    popular: true,
    features: [
      "600 credits/month",
      "Full Pro UI access",
      "3 concurrent generations",
      "All models",
      "Camera controls",
      "Advanced parameters",
      "Priority support",
    ],
  },
  {
    name: "Pro Plus",
    price: 49,
    period: "month",
    credits: 1200,
    features: [
      "1200 credits/month",
      "Full Pro UI access",
      "4 concurrent generations",
      "All models",
      "Camera controls",
      "API access",
      "Priority queue",
      "Dedicated support",
    ],
  },
  {
    name: "Enterprise",
    price: 249,
    period: "month",
    credits: 6000,
    features: [
      "6000 credits/month",
      "Full Pro UI access",
      "8 concurrent generations",
      "All models",
      "Camera controls",
      "API access",
      "Priority queue",
      "Team features",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
]

function PricingCard({ plan, isLite }: { plan: (typeof LITE_PLANS)[0]; isLite: boolean }) {
  return (
    <Card className={`p-6 relative ${plan.popular ? "border-accent border-2 shadow-xl" : ""}`}>
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
          Most Popular
        </Badge>
      )}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground">/{plan.period}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{plan.credits} credits/month</p>
        </div>

        <Button
          className={`w-full ${plan.popular ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
          variant={plan.popular ? "default" : "outline"}
        >
          {plan.price === 0 ? "Get Started" : "Select Plan"}
        </Button>

        <div className="space-y-3">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Higgsfield<span className="text-accent">AI</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Lite Mode
              </Link>
              <Link href="/generate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pro Mode
              </Link>
              <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Community
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Choose your <span className="text-accent">plan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Start free, upgrade when you need more. All plans include access to our AI models.
          </p>
        </div>
      </section>

      {/* Lite Plans */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Lite Plans</h2>
            <p className="text-muted-foreground">Perfect for beginners. Simple chat interface, no complexity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {LITE_PLANS.map((plan) => (
              <PricingCard key={plan.name} plan={plan} isLite={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Pro Plans */}
      <section className="py-16 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Pro Plans</h2>
            <p className="text-muted-foreground">For professionals. Full control over every parameter.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRO_PLANS.map((plan) => (
              <PricingCard key={plan.name} plan={plan} isLite={false} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">What's the difference between Lite and Pro?</h3>
              <p className="text-sm text-muted-foreground">
                Lite plans give you access to our simple chat interface - just describe what you want and AI handles the
                rest. Pro plans unlock the full UI with camera controls, advanced parameters, and preset customization.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">How do credits work?</h3>
              <p className="text-sm text-muted-foreground">
                Each generation costs credits based on the model and settings. Sora costs 29 credits, Nano Banana costs
                15, and Veo3 costs 50. Credits reset monthly.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I switch plans anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                prorate the difference.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
