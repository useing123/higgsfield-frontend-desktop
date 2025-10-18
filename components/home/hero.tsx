import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
        <Sparkles className="w-4 h-4" />
        AI-Powered Video Generation
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
        Turn ideas into <span className="text-accent">viral videos</span> in minutes
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
        Create stunning, high-quality videos by simply describing what you want. No complex tools or skills needed.
      </p>
    </div>
  )
}