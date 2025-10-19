
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Mock gallery - will be replaced with real user gallery in future
const GALLERY_IMAGES: { id: number; src: string; alt: string }[] = []

export function UserGallery() {
  if (GALLERY_IMAGES.length === 0) {
    return null // Hide gallery when there are no images
  }

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