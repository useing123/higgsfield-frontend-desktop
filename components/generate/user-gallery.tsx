
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const GALLERY_IMAGES = [
  { id: 1, src: "/abstract-colorful-paint.jpg", alt: "Abstract colorful paint" },
  { id: 2, src: "/astronaut-northern-lights-space.jpg", alt: "Astronaut northern lights space" },
  { id: 3, src: "/athlete-yellow-jersey-running.jpg", alt: "Athlete yellow jersey running" },
  { id: 4, src: "/cinematic-sunset-mountains.jpg", alt: "Cinematic sunset mountains" },
  { id: 5, src: "/dark-cinematic-raven-transformation.jpg", alt: "Dark cinematic raven transformation" },
  { id: 6, src: "/fashion-photoshoot-collage.jpg", alt: "Fashion photoshoot collage" },
  { id: 7, src: "/fashion-photoshoot-grid.jpg", alt: "Fashion photoshoot grid" },
  { id: 8, src: "/giant-hand-reaching.jpg", alt: "Giant hand reaching" },
  { id: 9, src: "/orange-sunset-desert-transition.jpg", alt: "Orange sunset desert transition" },
  { id: 10, src: "/person-sitting-meditation-room.jpg", alt: "Person sitting meditation room" },
]

export function UserGallery() {
  const displayedImages = GALLERY_IMAGES.slice(0, 8)

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Gallery</h2>
        <Link href="/gallery" passHref>
          <Button variant="outline">View All</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {displayedImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover aspect-square" />
          </Card>
        ))}
      </div>
    </div>
  )
}