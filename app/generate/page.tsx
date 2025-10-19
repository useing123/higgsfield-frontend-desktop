
import GeneratePageClient from "@/components/generate/GeneratePageClient"
import { Suspense } from "react"

const MODEL_CATEGORIES = ["Image to Video", "Text to Video", "Text to Image", "Speak"]

const UI_SCHEMAS: Record<string, { name: string; label: string; type: "string" | "number" | "boolean" | "enum" | "textarea" | "image"; options?: string[]; placeholder?: string }[]> = {
  "Image to Video": [
    { name: "prompt", label: "Prompt", type: "textarea", placeholder: "Describe the scene..." },
    { name: "input_image", label: "Input Image", type: "image", placeholder: "http://..." },
    { name: "aspect_ratio", label: "Aspect Ratio", type: "enum", options: ["16:9", "9:16", "1:1"] },
    { name: "camera_control", label: "Camera Control", type: "enum", options: ["zoom_in", "zoom_out", "pan_left", "pan_right", "static"] },
  ],
  "Text to Video": [
    { name: "prompt", label: "Prompt", type: "textarea", placeholder: "A cinematic masterpiece..." },
    { name: "duration", label: "Duration (s)", type: "number", placeholder: "6" },
    { name: "aspect_ratio", label: "Aspect Ratio", type: "enum", options: ["16:9", "9:16", "1:1"] },
    { name: "resolution", label: "Resolution", type: "enum", options: ["720", "1280"] },
  ],
  "Text to Image": [
    { name: "prompt", label: "Prompt", type: "textarea", placeholder: "A beautiful painting of..." },
    { name: "aspect_ratio", label: "Aspect Ratio", type: "enum", options: ["4:3", "16:9", "1:1"] },
    { name: "batch_size", label: "Batch Size", type: "number", placeholder: "1" },
    { name: "negative_prompt", label: "Negative Prompt", type: "textarea", placeholder: "blurry, ugly..." },
  ],
  "Speak": [
    { name: "prompt", label: "Prompt", type: "textarea", placeholder: "A character speaks..." },
    { name: "input_image", label: "Input Image", type: "image", placeholder: "http://..." },
    { name: "audio_prompt", label: "Audio Prompt", type: "string", placeholder: "A deep, resonant voice..." },
    { name: "aspect_ratio", label: "Aspect Ratio", type: "enum", options: ["16:9", "9:16", "1:1"] },
  ],
};

export default function GeneratePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GeneratePageClient modelCategories={MODEL_CATEGORIES} uiSchemas={UI_SCHEMAS} />
    </Suspense>
  )
}
