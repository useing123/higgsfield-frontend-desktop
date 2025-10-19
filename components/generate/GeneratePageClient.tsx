"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, Plus, ImageIcon, PanelLeft, PanelRight, PanelBottom, Download, Video } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { FormControlFactory } from "@/components/generate/form-control-factory"
import { UserGallery } from "@/components/generate/user-gallery"
import { apiService } from "@/services/apiService"
import { MODEL_CONFIG } from "@/lib/modelConfig"
import { Spinner } from "@/components/ui/spinner"

interface GeneratePageClientProps {
  modelCategories: string[];
  uiSchemas: Record<string, { name: string; label: string; type: "string" | "number" | "boolean" | "enum" | "textarea" | "image"; options?: string[]; placeholder?: string }[]>;
}

interface JobState {
  job_set_id: string;
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'completed' | 'queued';
  result_url?: string;
  progress?: number;
}

export default function GeneratePageClient({ modelCategories, uiSchemas }: GeneratePageClientProps) {
  const searchParams = useSearchParams()
  const [selectedModelCategory, setSelectedModelCategory] = useState(modelCategories[0])
  const [formData, setFormData] = useState<any>({})
  const [layout, setLayout] = useState<"left" | "right" | "bottom">("left")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentJob, setCurrentJob] = useState<JobState | null>(null)
  const [error, setError] = useState<string | null>(null)

  const schema = uiSchemas[selectedModelCategory]

  useEffect(() => {
    const initialFormData = schema.reduce((acc, field) => {
      if (field.type === 'boolean') {
        acc[field.name] = false
      } else if (field.type === 'number') {
        acc[field.name] = parseInt(field.placeholder || '0')
      } else if (field.type === 'enum' && field.options) {
        acc[field.name] = field.options[0]
      } else {
        acc[field.name] = ''
      }
      return acc
    }, {} as any)
    setFormData(initialFormData)
  }, [selectedModelCategory, schema])

  // Job polling effect
  useEffect(() => {
    if (!currentJob || currentJob.status === 'completed' || currentJob.status === 'succeeded' || currentJob.status === 'failed') {
      return
    }

    const pollInterval = setInterval(async () => {
      try {
        const jobData = await apiService.getJobStatus(currentJob.job_set_id)
        if (jobData && jobData.jobs && jobData.jobs.length > 0) {
          const mainJob = jobData.jobs[0]
          const newStatus = mainJob.status
          const newResultUrl = mainJob.result?.url || mainJob.results?.raw?.url || mainJob.results?.min?.url

          setCurrentJob(prev => ({
            ...prev!,
            status: newStatus,
            result_url: newResultUrl,
            progress: mainJob.progress || prev?.progress
          }))

          if (newStatus === 'completed' || newStatus === 'succeeded') {
            setIsGenerating(false)
          } else if (newStatus === 'failed') {
            setIsGenerating(false)
            setError('Generation failed. Please try again.')
          }
        }
      } catch (err) {
        console.error('Failed to poll job status:', err)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(pollInterval)
  }, [currentJob])

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    setError(null)
    setIsGenerating(true)
    setCurrentJob(null)

    try {
      const category = selectedModelCategory as keyof typeof MODEL_CONFIG
      const config = MODEL_CONFIG[category]
      const model = config.defaultModel

      let response

      // Prepare parameters based on category
      if (category === "Image to Video" || category === "Speak") {
        // Handle image input
        const inputImage = formData.input_image
        if (!inputImage) {
          throw new Error('Please provide an input image')
        }

        const params: any = {
          input_images: [{ type: "image_url", image_url: inputImage }],
          prompt: formData.prompt || '',
        }

        if (formData.aspect_ratio) params.aspect_ratio = formData.aspect_ratio
        if (formData.camera_control) params.camera_control = formData.camera_control
        if (formData.duration_sec) params.duration_sec = formData.duration_sec
        if (formData.audio_prompt) params.audio_prompt = formData.audio_prompt

        response = await apiService.generateImageToVideo(model, params)
      } else if (category === "Text to Video") {
        const params: any = {
          prompt: formData.prompt || '',
        }

        if (formData.aspect_ratio) params.aspect_ratio = formData.aspect_ratio
        if (formData.duration) params.duration = formData.duration
        if (formData.resolution) params.resolution = formData.resolution

        response = await apiService.generateTextToVideo(model, params)
      } else if (category === "Text to Image") {
        const params: any = {
          prompt: formData.prompt || '',
        }

        if (formData.aspect_ratio) params.aspect_ratio = formData.aspect_ratio
        if (formData.batch_size) params.batch_size = formData.batch_size
        if (formData.negative_prompt) params.negative_prompt = formData.negative_prompt

        response = await apiService.generateTextToImage(model, params)
      }

      if (response && response.job_set_id) {
        setCurrentJob({
          job_set_id: response.job_set_id,
          status: response.status || 'pending',
          progress: 0
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start generation')
      setIsGenerating(false)
      console.error('Generation failed:', err)
    }
  }

  const handleDownload = async () => {
    if (!currentJob?.result_url) return

    try {
      const response = await fetch(currentJob.result_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const isVideo = currentJob.result_url.endsWith('.mp4')
      a.download = `higgsfield-${currentJob.job_set_id.slice(0, 8)}.${isVideo ? 'mp4' : 'png'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex h-[calc(100vh-3.5rem)]">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
              {modelCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedModelCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedModelCategory === category
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-lg">
                <Button variant={layout === 'left' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLayout('left')}><PanelLeft className="w-5 h-5" /></Button>
                <Button variant={layout === 'right' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLayout('right')}><PanelRight className="w-5 h-5" /></Button>
                <Button variant={layout === 'bottom' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLayout('bottom')}><PanelBottom className="w-5 h-5" /></Button>
              </div>
            </div>

            <div className={`flex gap-8 ${layout === 'bottom' ? 'flex-col' : 'flex-col md:flex-row'}`}>
              {/* Input Panel */}
              <div className={`space-y-6 ${layout === 'bottom' ? 'w-full' : 'md:w-1/2'} ${layout === 'right' ? 'order-2' : ''}`}>
                <h2 className="text-2xl font-bold">Inputs</h2>
                <div className="space-y-4">
                  {schema.map((field) => (
                    <FormControlFactory
                      key={field.name}
                      fieldSchema={field}
                      value={formData[field.name]}
                      onChange={(value) => handleFieldChange(field.name, value)}
                    />
                  ))}
                </div>
                <Button
                  className="w-full bg-[#c4ff00] text-black hover:bg-[#b0e600] font-semibold"
                  size="lg"
                  onClick={handleGenerate}
                >
                  Generate
                </Button>
              </div>

              {/* Output Panel */}
              <div className={`space-y-6 ${layout === 'bottom' ? 'w-full' : 'md:w-1/2'} ${layout === 'right' ? 'order-1' : ''}`}>
                <h2 className="text-2xl font-bold">Output</h2>

                {error && (
                  <div className="p-4 border border-red-500/50 rounded-lg bg-red-950/20">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Loading State */}
                {isGenerating && (!currentJob || (currentJob.status !== 'completed' && currentJob.status !== 'succeeded')) && (
                  <div className="p-6 border border-lime-500/30 rounded-lg bg-zinc-900/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <Spinner className="text-lime-500" />
                      <div>
                        <p className="text-sm font-semibold text-white">Generating your content...</p>
                        {currentJob && (
                          <p className="text-xs text-zinc-500">Job ID: {currentJob.job_set_id.slice(0, 12)}...</p>
                        )}
                      </div>
                    </div>
                    <div className="aspect-video bg-zinc-800 rounded-lg animate-pulse flex items-center justify-center">
                      <div className="text-zinc-600">
                        {selectedModelCategory.includes('Video') ? <Video className="w-12 h-12" /> : <ImageIcon className="w-12 h-12" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed State */}
                {currentJob && (currentJob.status === 'completed' || currentJob.status === 'succeeded') && currentJob.result_url && (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border border-lime-500/30">
                      {currentJob.result_url.endsWith('.mp4') ? (
                        <video
                          src={currentJob.result_url}
                          controls
                          className="w-full"
                        />
                      ) : (
                        <img
                          src={currentJob.result_url}
                          alt="Generated Content"
                          className="w-full"
                        />
                      )}
                    </div>
                    <Button
                      onClick={handleDownload}
                      className="w-full bg-lime-500 hover:bg-lime-400 text-black font-semibold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download {currentJob.result_url.endsWith('.mp4') ? 'Video' : 'Image'}
                    </Button>
                  </div>
                )}

                {/* Empty State */}
                {!isGenerating && !currentJob && (
                  <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10">
                    <div className="text-center text-white/40">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                      <p>Your generation will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <UserGallery />
          </div>
        </main>
      </div>
    </div>
  )
}