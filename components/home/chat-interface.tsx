"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, Mic, ArrowRight } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

const typingPrompts = [
  "A cinematic drone shot flying over a misty mountain at sunrise",
  "Create a viral product showcase video with dynamic camera movements",
  "Generate a dreamy slow-motion scene with particles floating",
  "Make a professional talking head video with perfect lighting",
  "An epic fantasy castle with dragons flying in the background",
  "Create a neon-lit cyberpunk city street at night with rain",
  "Generate a peaceful meditation scene in a Japanese zen garden",
  "A time-lapse of a blooming flower in 4K quality",
];

export function ChatInterface() {
  const [prompt, setPrompt] = useState("")
  const router = useRouter()
  const [placeholder, setPlaceholder] = useState('')
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  const suggestions = [
    "Create a cinematic sunset video with a crane shot",
    "Make a viral product showcase video",
    "Generate a dreamy slow-motion scene",
    "Create an energetic dance video",
  ]

  // Animated typing effect for placeholder
  useEffect(() => {
    if (prompt.length > 0) {
      setPlaceholder('');
      return;
    }

    const currentPrompt = typingPrompts[currentPromptIndex];
    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;

    if (isTyping) {
      // Typing phase
      typingInterval = setInterval(() => {
        if (currentIndex <= currentPrompt.length) {
          setPlaceholder(currentPrompt.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
        }
      }, 50); // Typing speed
    } else {
      // Wait phase before switching to next prompt
      const waitTimeout = setTimeout(() => {
        setCurrentPromptIndex((prev) => (prev + 1) % typingPrompts.length);
        setIsTyping(true);
      }, 15000); // 15 seconds

      return () => clearTimeout(waitTimeout);
    }

    return () => clearInterval(typingInterval);
  }, [currentPromptIndex, isTyping, prompt]);

  const handleSubmit = () => {
    if (!prompt.trim()) return
    router.push(`/lite?prompt=${encodeURIComponent(prompt)}`)
  }

  return (
    <>
      <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl">

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder={placeholder || "Describe what you want to create..."}
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