"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Upload, Sparkles, X, Plus, ImageIcon, Video, Wand2, Zap, Settings, Bot, User, ArrowUp } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const PRESET_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "new", name: "New" },
  { id: "start_end", name: "Start & End" },
  { id: "effects", name: "Effects" },
  { id: "viral", name: "Viral" },
  { id: "camera", name: "Camera Control" },
]

const PRESETS = [
  {
    id: "raven_transition",
    name: "RAVEN TRANSITION",
    category: "start_end",
    thumbnail: "/dark-cinematic-raven-transformation.jpg",
    model: "kling",
  },
  {
    id: "pizza_fall",
    name: "PIZZA FALL",
    category: "viral",
    thumbnail: "/pizza-falling-in-stadium.jpg",
    model: "kling",
  },
  {
    id: "northern_lights",
    name: "NORTHERN LIGHTS",
    category: "effects",
    thumbnail: "/astronaut-northern-lights-space.jpg",
    model: "kling",
  },
  {
    id: "giant_grab",
    name: "GIANT GRAB",
    category: "viral",
    thumbnail: "/giant-hand-reaching.jpg",
    model: "kling",
  },
  {
    id: "aquarium",
    name: "AQUARIUM",
    category: "camera",
    thumbnail: "/person-sitting-meditation-room.jpg",
    model: "kling",
  },
  {
    id: "furies_around",
    name: "FURIES AROUND",
    category: "effects",
    thumbnail: "/woman-orange-jacket-couch.jpg",
    model: "kling",
  },
  {
    id: "flying_transition",
    name: "FLYING TRANSITION",
    category: "start_end",
    thumbnail: "/orange-sunset-desert-transition.jpg",
    model: "kling",
  },
  {
    id: "seamless_transition",
    name: "SEAMLESS TRANSITION",
    category: "start_end",
    thumbnail: "/underwater-pool-transition.jpg",
    model: "kling",
  },
  {
    id: "beast_mode",
    name: "BEAST MODE",
    category: "viral",
    thumbnail: "/athlete-yellow-jersey-running.jpg",
    model: "kling",
  },
]

const MODELS = [
  { id: "higgsfield", name: "Higgsfield", icon: Sparkles },
  { id: "sora2", name: "Sora 2", icon: Video },
  { id: "veo31", name: "Veo 3.1", icon: Video },
  { id: "kling", name: "Kling", icon: Zap },
  { id: "wan25", name: "Wan 2.5", icon: Wand2 },
]

export default function LitePage() {
  const [mode, setMode] = useState<"autopilot" | "copilot">("autopilot")
  const [selectedModel, setSelectedModel] = useState("kling")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [showFashionFactory, setShowFashionFactory] = useState(false)
  const [fashionFactoryStep, setFashionFactoryStep] = useState(1)
  const [showDrawToEdit, setShowDrawToEdit] = useState(false)
  const [drawMode, setDrawMode] = useState("sketch")
  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState("16:9")

  const filteredPresets = selectedCategory === "all" ? PRESETS : PRESETS.filter((p) => p.category === selectedCategory)

  const suggestions = [
    { title: "What You Can Do?", description: "Explore Higgsfield AI Features" },
    { title: "How Can I Create Stunning Content?", description: "Tips for writing better AI prompts" },
    { title: "Generate Soul Image Prompt", description: "Write a prompt for high-aesthetic images" },
    { title: "Generate Video Prompt", description: "Write a prompt for cinematic videos" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-zinc-900 rounded-full p-1">
            <Button
              onClick={() => setMode("autopilot")}
              className={`px-4 py-2 text-sm rounded-full ${
                mode === "autopilot" ? "bg-zinc-700 text-white" : "bg-transparent text-zinc-400"
              }`}
            >
              Autopilot
            </Button>
            <Button
              onClick={() => setMode("copilot")}
              className={`px-4 py-2 text-sm rounded-full ${
                mode === "copilot" ? "bg-zinc-700 text-white" : "bg-transparent text-zinc-400"
              }`}
            >
              Copilot
            </Button>
          </div>
        </div>

        {mode === "autopilot" ? (
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <Bot className="w-16 h-16 mx-auto text-green-500" />
              <h1 className="text-4xl font-bold mt-4">Higgsfield Assist</h1>
              <p className="text-zinc-400 mt-2">A team of PhDs in your pocket, built for creators.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="bg-zinc-900 p-4 text-left hover:bg-zinc-800 cursor-pointer">
                  <h3 className="font-semibold text-white">{suggestion.title}</h3>
                  <p className="text-zinc-400 text-sm">{suggestion.description}</p>
                </Card>
              ))}
            </div>
            <div className="relative">
              <Textarea
                placeholder="Send a message..."
                className="w-full bg-zinc-900 rounded-full px-6 py-4 pr-20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                <Button size="sm" variant="ghost" className="text-zinc-400">
                  ChatGPT 5 Mini
                </Button>
                <Button size="icon" className="bg-green-500 rounded-full ml-2">
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl font-bold">CREATE SORA 2 TRENDS SIMPLE, FAST, AND ACCESSIBLE</h1>
            <p className="text-zinc-400">
              Turn ideas into viral videos in minutes – no complex tools or skills needed.
              <br />
              <a href="#" className="text-green-500">
                Explore more about Sora 2
              </a>
            </p>
            <Card className="p-6 bg-zinc-900">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" className="text-green-500">
                  TikTok
                </Button>
                <Button variant="ghost" className="text-zinc-400">
                  YouTube Shorts
                </Button>
                <Button variant="ghost" className="text-zinc-400">
                  Instagram Reels
                </Button>
                <Button variant="ghost" className="text-zinc-400">
                  YouTube
                </Button>
              </div>
              <Textarea
                placeholder="Type your video idea or topic..."
                className="w-full bg-zinc-800 rounded-lg p-4 mb-4"
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" className="text-zinc-400">
                    <Settings className="w-5 h-5 mr-2" />
                    Visuals & Sound
                  </Button>
                  <Button variant="ghost" className="text-zinc-400">
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                  </Button>
                  <div className="flex items-center gap-2">
                    <Switch id="unlimited-switch" />
                    <Label htmlFor="unlimited-switch">Unlimited</Label>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-zinc-400">Preset</p>
                    <p className="font-bold">GENERAL</p>
                  </div>
                  <Button className="bg-green-500 text-black font-bold">
                    Generate <span className="ml-2 bg-black/20 text-white px-2 py-1 rounded">29</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}