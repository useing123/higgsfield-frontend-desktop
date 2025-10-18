
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowRight, Bot, User } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [mode, setMode] = useState<"autopilot" | "copilot">("autopilot")
  const searchParams = useSearchParams()

  useEffect(() => {
    const initialPrompt = searchParams.get("prompt")
    if (initialPrompt) {
      setPrompt(initialPrompt)
      setMessages([{ role: "user", content: initialPrompt }])
      // Automatically submit the prompt
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `[${mode.toUpperCase()}] Generating response for: "${initialPrompt}"`,
          },
        ])
      }, 1000)
    }
  }, [searchParams, mode])

  const handleSubmit = () => {
    if (!prompt.trim()) return

    const newMessages: Message[] = [...messages, { role: "user", content: prompt }]
    setMessages(newMessages)
    const currentPrompt = prompt
    setPrompt("")

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `[${mode.toUpperCase()}] Generating response for: "${currentPrompt}"`,
        },
      ])
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="mode-switch" className={mode === 'copilot' ? 'text-muted-foreground' : ''}>Autopilot</Label>
        <Switch
          id="mode-switch"
          checked={mode === "copilot"}
          onCheckedChange={(checked) => setMode(checked ? "copilot" : "autopilot")}
        />
        <Label htmlFor="mode-switch" className={mode === 'autopilot' ? 'text-muted-foreground' : ''}>Copilot</Label>
      </div>

      <Card className="p-4 bg-zinc-900 border-zinc-800 shadow-lg">
        <div className="mb-4 space-y-4 h-96 overflow-y-auto p-2 rounded-lg bg-zinc-950">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && <Bot className="w-6 h-6 text-zinc-500" />}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2 ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
              {msg.role === "user" && <User className="w-6 h-6 text-zinc-500" />}
            </div>
          ))}
        </div>

        <div className="relative">
          <Textarea
            placeholder={
              mode === "autopilot"
                ? "Describe your video idea, and I'll create it for you..."
                : "Let's create a video together. What's the first step?"
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            className="min-h-[80px] pr-16 resize-none text-base bg-zinc-800 border-zinc-700 placeholder-zinc-500 text-white"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-3 right-3 h-10 w-10"
            onClick={handleSubmit}
            disabled={!prompt.trim()}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}