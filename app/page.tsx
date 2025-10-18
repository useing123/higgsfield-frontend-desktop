"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Sparkles, Upload, Mic, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])

  const suggestions = [
    "Create a cinematic sunset video with a crane shot",
    "Make a viral product showcase video",
    "Generate a dreamy slow-motion scene",
    "Create an energetic dance video",
  ]

  const handleSubmit = () => {
    if (!prompt.trim()) return

    setMessages([...messages, { role: "user", content: prompt }])
    setPrompt("")

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'll create that for you using our best AI model. Generating your video now...",
        },
      ])
    }, 1000)
  }

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
              <Link href="/generate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pro Mode
              </Link>
              <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Community
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Text */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Video Generation
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Turn ideas into <span className="text-accent">viral videos</span> in minutes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Create stunning, high-quality videos by simply describing what you want. No complex tools or skills
              needed.
            </p>
          </div>

          {/* Chat Interface */}
          <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl">
            {/* Messages */}
            {messages.length > 0 && (
              <div className="mb-6 space-y-4 max-h-64 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="Describe what you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                  className="min-h-[120px] pr-24 resize-none text-base bg-background/50"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-accent">1 free generation</span> • No credit card required
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Generate
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Suggestions */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Try these examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(suggestion)}
                  className="px-4 py-2 rounded-full bg-muted/50 hover:bg-muted text-sm text-foreground transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8">
            <Link href="/generate">
              <Button variant="outline" size="lg">
                Need more control? Try Pro Mode
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="border-t border-border/40 py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Our multi-agent system automatically selects the best model and optimizes your prompt for stunning
                results.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Generate high-quality videos in seconds. No waiting, no complexity, just results.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Just describe what you want. Upload images, add details, and let AI handle the rest.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
