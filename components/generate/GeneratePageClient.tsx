"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, Plus, ImageIcon, PanelLeft, PanelRight, PanelBottom } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { FormControlFactory } from "@/components/generate/form-control-factory"
import { UserGallery } from "@/components/generate/user-gallery"

interface GeneratePageClientProps {
  modelCategories: string[];
  uiSchemas: Record<string, { name: string; label: string; type: "string" | "number" | "boolean" | "enum" | "textarea"; options?: string[]; placeholder?: string }[]>;
}

export default function GeneratePageClient({ modelCategories, uiSchemas }: GeneratePageClientProps) {
  const searchParams = useSearchParams()
  const [selectedModelCategory, setSelectedModelCategory] = useState(modelCategories[0])
  const [formData, setFormData] = useState<any>({})
  const [layout, setLayout] = useState<"left" | "right" | "bottom">("left")

  const schema = uiSchemas[selectedModelCategory]

  useEffect(() => {
    const initialFormData = schema.reduce((acc, field) => {
      if (field.type === 'boolean') {
        acc[field.name] = false
      } else if (field.type === 'number') {
        acc[field.name] = parseInt(field.placeholder || '0')
      } else {
        acc[field.name] = ''
      }
      return acc
    }, {} as any)
    setFormData(initialFormData)
  }, [selectedModelCategory, schema])

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = () => {
    console.log("Generating with data:", {
      category: selectedModelCategory,
      ...formData,
    })
    // API call would go here
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
                <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white/40">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                    <p>Your generation will appear here</p>
                  </div>
                </div>
              </div>
            </div>
            <UserGallery />
          </div>
        </main>
      </div>
    </div>
  )
}