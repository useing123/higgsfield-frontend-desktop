import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Play, Sparkles } from "lucide-react"
import Link from "next/link"

const COMMUNITY_ITEMS = [
  {
    id: 1,
    title: "Cinematic Sunset",
    preset: "Sora",
    prompt: "A breathtaking sunset over mountains with a crane shot",
    likes: 234,
    thumbnail: "/cinematic-sunset-mountains.jpg",
  },
  {
    id: 2,
    title: "Product Showcase",
    preset: "Sora",
    prompt: "Modern tech product rotating on a pedestal with dramatic lighting",
    likes: 189,
    thumbnail: "/product-showcase-tech.jpg",
  },
  {
    id: 3,
    title: "Sketch Animation",
    preset: "Nano Banana",
    prompt: "Hand-drawn character coming to life",
    likes: 156,
    thumbnail: "/sketch-animation-character.jpg",
  },
  {
    id: 4,
    title: "Urban Exploration",
    preset: "Veo3",
    prompt: "FPV drone flying through a neon-lit city at night",
    likes: 312,
    thumbnail: "/urban-neon-city-night.jpg",
  },
  {
    id: 5,
    title: "Nature Documentary",
    preset: "Sora",
    prompt: "Wildlife in their natural habitat, cinematic slow motion",
    likes: 278,
    thumbnail: "/wildlife-nature-documentary.jpg",
  },
  {
    id: 6,
    title: "Abstract Art",
    preset: "Nano Banana",
    prompt: "Colorful paint strokes morphing into shapes",
    likes: 145,
    thumbnail: "/abstract-colorful-paint.jpg",
  },
]

export default function CommunityPage() {
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
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
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
      <section className="border-b border-border/40 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Community Showcase
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Created by the <span className="text-accent">Community</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Explore amazing videos created by our community. Get inspired and remix their creations.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            <Button variant="default" size="sm" className="bg-accent text-accent-foreground">
              All
            </Button>
            <Button variant="outline" size="sm">
              Sora
            </Button>
            <Button variant="outline" size="sm">
              Nano Banana
            </Button>
            <Button variant="outline" size="sm">
              Veo3
            </Button>
            <Button variant="outline" size="sm">
              Trending
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITY_ITEMS.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="icon" className="rounded-full w-16 h-16 bg-accent text-accent-foreground">
                      <Play className="w-6 h-6" fill="currentColor" />
                    </Button>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">{item.preset}</Badge>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.prompt}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{item.likes}</span>
                    </button>
                    <Link href={`/generate?preset=${item.preset.toLowerCase().replace(" ", "_")}`}>
                      <Button variant="outline" size="sm">
                        Remix
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
