"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, Mic, ArrowRight } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([])

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
    <>
      <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl">
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
    </>
  )
}