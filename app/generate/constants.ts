import { Sparkles, Video, Wand2, Zap } from "lucide-react"

export const PRESET_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "new", name: "New" },
  { id: "start_end", name: "Start & End" },
  { id: "effects", name: "Effects" },
  { id: "viral", name: "Viral" },
  { id: "camera", name: "Camera Control" },
]

export const PRESETS = [
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

export const MODELS = [
  { id: "higgsfield", name: "Higgsfield", icon: Sparkles },
  { id: "sora2", name: "Sora 2", icon: Video },
  { id: "veo31", name: "Veo 3.1", icon: Video },
  { id: "kling", name: "Kling", icon: Zap },
  { id: "wan25", name: "Wan 2.5", icon: Wand2 },
]

export const CAMERA_MOTIONS = [
  { id: "static", name: "Static" },
  { id: "dolly_in", name: "Dolly In" },
  { id: "dolly_out", name: "Dolly Out" },
  { id: "crane_up", name: "Crane Up" },
  { id: "crane_down", name: "Crane Down" },
  { id: "pan_left", name: "Pan Left" },
  { id: "pan_right", name: "Pan Right" },
  { id: "fpv_arc", name: "FPV Arc" },
]