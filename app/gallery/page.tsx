
import GalleryPageClient from "@/components/gallery/GalleryPageClient"
import { Project } from "@/components/gallery/project-popup"

const ALL_PROJECTS: Project[] = [
  { id: 1, src: "/dark-cinematic-raven-transformation.jpg", alt: "Project 1", title: "Raven Transition", date: "2024-07-20", prompt: "A raven in a dark forest...", model: "Kling 2.5 Turbo" },
  { id: 2, src: "/pizza-falling-in-stadium.jpg", alt: "Project 2", title: "Pizza Fall", date: "2024-07-19", prompt: "A giant pizza falling from the sky...", model: "Minimax Hailuo 02" },
  { id: 3, src: "/astronaut-northern-lights-space.jpg", alt: "Project 3", title: "Northern Lights", date: "2024-07-18", prompt: "An astronaut in space...", model: "Seedance 1.0" },
  { id: 4, src: "/giant-hand-reaching.jpg", alt: "Project 4", title: "Giant Grab", date: "2024-07-17", prompt: "A giant hand grabbing a skyscraper...", model: "Veo 3" },
  { id: 5, src: "/person-sitting-meditation-room.jpg", alt: "Project 5", title: "Aquarium", date: "2024-07-16", prompt: "A person meditating in an aquarium...", model: "Wan 2.5 Fast" },
  { id: 6, src: "/woman-orange-jacket-couch.jpg", alt: "Project 6", title: "Furies Around", date: "2024-07-15", prompt: "A woman surrounded by furies...", model: "Minimax Hailuo 02" },
  { id: 7, src: "/orange-sunset-desert-transition.jpg", alt: "Project 7", title: "Flying Transition", date: "2024-07-14", prompt: "A person transitioning into a bird...", model: "Seedance 1.0 Lite" },
  { id: 8, src: "/underwater-pool-transition.jpg", alt: "Project 8", title: "Seamless Transition", date: "2024-07-13", prompt: "A seamless transition from a pool to the ocean...", model: "Nano Banana" },
  { id: 9, src: "/athlete-yellow-jersey-running.jpg", alt: "Project 9", title: "Beast Mode", date: "2024-07-12", prompt: "An athlete in 'beast mode'...", model: "Seedream 4.0" },
  { id: 10, src: "/urban-neon-city-night.jpg", alt: "Project 10", title: "City Lights", date: "2024-07-11", prompt: "A bustling city at night...", model: "Veo 3 Speak" },
  { id: 11, src: "/wildlife-nature-documentary.jpg", alt: "Project 11", title: "Ocean Deep", date: "2024-07-10", prompt: "The mysterious depths of the ocean...", model: "Kling 2.5 Turbo" },
  { id: 12, src: "/abstract-colorful-paint.jpg", alt: "Project 12", title: "Forest Spirit", date: "2024-07-09", prompt: "A mystical spirit in an ancient forest...", model: "Minimax Hailuo 02" },
];

export default function GalleryPage() {
  return <GalleryPageClient projects={ALL_PROJECTS} />
}