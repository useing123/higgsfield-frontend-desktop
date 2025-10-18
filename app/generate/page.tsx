
import GeneratePageClient from "@/components/generate/GeneratePageClient"
import { Suspense } from "react"

const MODEL_CATEGORIES = ["Image to Video", "Text to Video", "Text to Image", "Speak"]

const UI_SCHEMAS: Record<string, { name: string; label: string; type: "string" | "number" | "boolean" | "enum" | "textarea"; options?: string[]; placeholder?: string }[]> = {
  "Image to Video": [
    { name: "prompt", label: "Prompt", type: "textarea", placeholder: "Describe the scene..." },
    { name: "input_image", label: "Input Image", type: "string", placeholder: "http://..." },
    { name: "duration", label: "Duration (s)", type: "number", placeholder: "5" },
    { name: "enhance_prompt", label: "Enhance Prompt", type: "boolean" },
  ],
  "Text to Video": [
    { name: "prompt", label: "Prompt", type: "textarea", placeholder: "A cinematic masterpiece..." },
    { name: "duration", label: "Duration (s)", type: "number", placeholder: "6" },
    { name: "resolution", label: "Resolution", type: "enum", options: ["768", "1024"] },
    { name: "enable_prompt_optimizier", label: "Optimize Prompt", type: "boolean" },
  ],
  "Text to Image": [
    { name: "prompt", label: "Prompt", type: "textarea", placeholder: "A beautiful painting of..." },
    { name: "quality", label: "Quality", type: "enum", options: ["basic", "standard", "hd"] },
    { name: "aspect_ratio", label: "Aspect Ratio", type: "enum", options: ["4:3", "16:9", "1:1"] },
  ],
  "Speak": [
    { name: "prompt", label: "Prompt", type: "textarea", placeholder: "A character speaks..." },
    { name: "input_image", label: "Input Image", type: "string", placeholder: "http://..." },
    { name: "audio_prompt", label: "Audio Prompt", type: "string", placeholder: "A deep, resonant voice..." },
    { name: "background_prompt", label: "Background Prompt", type: "string", placeholder: "A quiet library..." },
    { name: "quality", label: "Quality", type: "enum", options: ["basic", "standard"] },
    { name: "aspect_ratio", label: "Aspect Ratio", type: "enum", options: ["16:9", "9:16", "1:1"] },
    { name: "enhance_prompt", label: "Enhance Prompt", type: "boolean" },
  ],
};

export default function GeneratePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GeneratePageClient modelCategories={MODEL_CATEGORIES} uiSchemas={UI_SCHEMAS} />
    </Suspense>
  )
}
