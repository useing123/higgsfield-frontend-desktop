"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Upload, Sparkles, X, Plus, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { PRESET_CATEGORIES, PRESETS, MODELS } from "./constants"
import { useGeneration } from "@/hooks/useGeneration"

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const { data, error, isLoading, generate } = useGeneration()
  const [selectedModel, setSelectedModel] = useState("kling")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [showFashionFactory, setShowFashionFactory] = useState(false)
  const [fashionFactoryStep, setFashionFactoryStep] = useState(1)
  const [showDrawToEdit, setShowDrawToEdit] = useState(false)
  const [drawMode, setDrawMode] = useState("sketch")
  const [prompt, setPrompt] = useState("")
  const [cameraMotion, setCameraMotion] = useState("static")
  const [duration, setDuration] = useState([12])
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [credits] = useState(150)

  const filteredPresets = selectedCategory === "all" ? PRESETS : PRESETS.filter((p) => p.category === selectedCategory)

  const handleGenerate = () => {
    // This is a placeholder. In a real app, you'd get the correct params
    // based on the selected model and other form inputs.
    generate({
      type: "text2image",
      params: {
        prompt,
        width_and_height: "1696x960",
        enhance_prompt: true,
        quality: "720p",
        batch_size: 1,
      },
    })
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-zinc-950 p-4 space-y-4 overflow-y-auto">
          {/* Current Preset Thumbnail */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 group cursor-pointer">
            {selectedPreset ? (
              <>
                <img
                  src={PRESETS.find((p) => p.id === selectedPreset)?.thumbnail || "/placeholder.svg"}
                  alt="Current preset"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="secondary" className="text-xs">
                    Change
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[#c4ff00] text-black text-xs font-bold">GENERAL</Badge>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-xs text-white/40">No preset selected</p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-wide">Optional</p>
            <Button
              variant="outline"
              className="w-full justify-start border-white/10 bg-zinc-900 hover:bg-zinc-800 text-white/80"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload image or generate it
            </Button>
            <p className="text-xs text-white/40">PNG, JPG or Paste from clipboard</p>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-xs text-white/60 font-medium">Prompt</label>
            <Textarea
              placeholder="Describe the scene you imagine, with details."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px] bg-zinc-900 border-white/10 text-white placeholder:text-white/30 text-sm resize-none"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs text-white/60 font-medium">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                <SelectItem value="kling">Kling 2.5 Turbo ⚡</SelectItem>
                <SelectItem value="sora2">Sora 2</SelectItem>
                <SelectItem value="veo31">Veo 3.1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration & Aspect Ratio */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/60 font-medium">Duration</label>
              <Select value={duration[0].toString()} onValueChange={(v) => setDuration([Number.parseInt(v)])}>
                <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="12">12s</SelectItem>
                  <SelectItem value="30">30s</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/60 font-medium">Aspect Ratio</label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="9:16">9:16</SelectItem>
                  <SelectItem value="1:1">1:1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            className="w-full bg-[#c4ff00] text-black hover:bg-[#b0e600] font-semibold"
            size="lg"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : <><Sparkles className="w-4 h-4 mr-2" /> Generate</>}
            <Badge className="ml-2 bg-black/20 text-black">29</Badge>
          </Button>

          {error && <p className="text-xs text-center text-red-500">Error: {error.message}</p>}

          <p className="text-xs text-center text-white/40">Explore more about Sora 2</p>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Model Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {MODELS.map((model) => {
                const Icon = model.icon
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedModel === model.id
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {model.name}
                  </button>
                )
              })}
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-[#c4ff00] text-black"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Special Feature Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card
                className="p-6 bg-zinc-900 border-white/10 cursor-pointer hover:border-[#c4ff00]/50 transition-colors group"
                onClick={() => setShowFashionFactory(true)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Fashion Factory</h3>
                    <p className="text-sm text-white/60">Create branded photoshoots with consistent characters</p>
                  </div>
                  <Badge className="bg-[#c4ff00] text-black text-xs">NEW</Badge>
                </div>
                <div className="aspect-video rounded-lg bg-zinc-800 overflow-hidden">
                  <img
                    src="/fashion-photoshoot-grid.jpg"
                    alt="Fashion Factory"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </Card>

              <Card
                className="p-6 bg-zinc-900 border-white/10 cursor-pointer hover:border-[#c4ff00]/50 transition-colors group"
                onClick={() => setShowDrawToEdit(true)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Draw to Edit</h3>
                    <p className="text-sm text-white/60">Sketch to complete picture in seconds</p>
                  </div>
                  <Badge className="bg-[#c4ff00] text-black text-xs">NEW</Badge>
                </div>
                <div className="aspect-video rounded-lg bg-zinc-800 overflow-hidden">
                  <img
                    src="/sketch-drawing-interface.jpg"
                    alt="Draw to Edit"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </Card>
            </div>

            {/* Preset Grid */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Presets</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPresets.map((preset) => (
                  <Card
                    key={preset.id}
                    className="group cursor-pointer overflow-hidden bg-zinc-900 border-white/10 hover:border-[#c4ff00]/50 transition-all"
                    onClick={() => setSelectedPreset(preset.id)}
                  >
                    <div className="aspect-video relative overflow-hidden bg-zinc-800">
                      <img
                        src={preset.thumbnail || "/placeholder.svg"}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {preset.category === "start_end" && (
                        <Badge className="absolute top-2 right-2 bg-white/90 text-black text-xs">Start & End</Badge>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-white">{preset.name}</h3>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Fashion Factory Modal */}
      <Dialog open={showFashionFactory} onOpenChange={setShowFashionFactory}>
        <DialogContent className="max-w-4xl bg-zinc-900 border-white/10 text-white p-0">
          <button
            onClick={() => setShowFashionFactory(false)}
            className="absolute top-4 right-4 z-10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex h-[600px]">
            {/* Step Sidebar */}
            <div className="w-48 bg-black/40 p-6 space-y-4">
              <h3 className="font-bold text-sm mb-6">Fashion factory</h3>
              {[
                { num: 1, icon: "📄", label: "Template" },
                { num: 2, icon: "👤", label: "Character" },
                { num: 3, icon: "🎬", label: "Generation" },
                { num: 4, icon: "👔", label: "Clothing" },
                { num: 5, icon: "📸", label: "Photo set" },
              ].map((step) => (
                <button
                  key={step.num}
                  onClick={() => setFashionFactoryStep(step.num)}
                  className={`flex items-center gap-3 w-full text-left ${
                    fashionFactoryStep === step.num ? "text-white" : "text-white/40"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      fashionFactoryStep === step.num ? "bg-[#c4ff00] text-black" : "bg-white/10"
                    }`}
                  >
                    {step.num}
                  </div>
                  <span className="text-sm">{step.label}</span>
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div className="flex-1 p-8">
              {fashionFactoryStep === 1 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-48 h-48 rounded-2xl bg-zinc-800 mb-6 overflow-hidden">
                    <img
                      src="/fashion-photoshoot-collage.jpg"
                      alt="Fashion Factory"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">FASHION FACTORY</h2>
                  <p className="text-white/60 max-w-md mb-8">
                    Easily create branded photoshoots by combining your product with a consistent character, delivering
                    unique and professional visuals every time.
                  </p>
                  <Button className="bg-white text-black hover:bg-white/90">Select template</Button>
                </div>
              )}

              {fashionFactoryStep === 2 && (
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Select or create character</h2>
                    <p className="text-sm text-white/60">Choose how your character moves and how the camera follows</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <Card className="bg-zinc-800 border-white/10 cursor-pointer hover:border-[#c4ff00]/50 transition-colors flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center mx-auto mb-3">
                          <Plus className="w-8 h-8 text-white/40" />
                        </div>
                        <p className="text-sm font-medium">Create new</p>
                        <p className="text-xs text-white/40">Build your own AI character</p>
                      </div>
                    </Card>

                    {["KION", "CAROLINE", "JAMEL", "NICOLE", "ANORA"].map((name) => (
                      <Card
                        key={name}
                        className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-white/10 cursor-pointer hover:border-[#c4ff00]/50 transition-colors p-4 flex items-end"
                      >
                        <p className="font-bold text-sm">{name}</p>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      className="border-white/10 bg-transparent"
                      onClick={() => setFashionFactoryStep(1)}
                    >
                      Back
                    </Button>
                    <Button className="bg-zinc-700 text-white/40" disabled>
                      Generate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Draw to Edit Modal */}
      <Dialog open={showDrawToEdit} onOpenChange={setShowDrawToEdit}>
        <DialogContent className="max-w-3xl bg-zinc-900 border-white/10 text-white">
          <button
            onClick={() => setShowDrawToEdit(false)}
            className="absolute top-4 right-4 z-10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[
                { id: "sketch", label: "Sketch to Video", badge: "NEW" },
                { id: "draw", label: "Draw to Video" },
                { id: "edit", label: "Draw to Edit" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDrawMode(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    drawMode === tab.id ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab.label}
                  {tab.badge && (
                    <Badge className="absolute -top-1 -right-1 bg-[#c4ff00] text-black text-xs px-1 py-0">
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="text-center max-w-md mx-auto">
              <div className="relative mb-6">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs">
                  Powered by Sora 2 ⚡
                </Badge>
                <div className="w-48 h-48 rounded-2xl bg-zinc-800 mx-auto mt-4 overflow-hidden">
                  <img src="/sketch-drawing-stickfigures.jpg" alt="Sketch to Video" className="w-full h-full object-cover" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-3">
                {drawMode === "sketch" && "SKETCH TO VIDEO"}
                {drawMode === "draw" && "DRAW TO VIDEO"}
                {drawMode === "edit" && "DRAW TO EDIT"}
              </h2>

              <p className="text-white/60 mb-8">
                {drawMode === "sketch" && "Turn your quick sketch or storyboard into a fully animated video"}
                {drawMode === "draw" && "Transform your drawings into animated videos"}
                {drawMode === "edit" && "From sketch to a complete picture in a second. No prompt needed."}
              </p>

              <div className="space-y-3">
                <Button className="w-full bg-white text-black hover:bg-white/90">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Media
                </Button>
                <Button variant="outline" className="w-full border-white/10 bg-transparent hover:bg-white/5">
                  Create blank
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
