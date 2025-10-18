import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const communityImages = [
  { src: "/woman-orange-jacket-couch.jpg", alt: "Woman in orange jacket" },
  { src: "/dark-cinematic-raven-transformation.jpg", alt: "Cinematic raven transformation" },
  { src: "/astronaut-northern-lights-space.jpg", alt: "Astronaut in space" },
  { src: "/cinematic-sunset-mountains.jpg", alt: "Cinematic sunset" },
  { src: "/urban-neon-city-night.jpg", alt: "Neon city night" },
  { src: "/wildlife-nature-documentary.jpg", alt: "Wildlife documentary" },
  { src: "/fashion-photoshoot-collage.jpg", alt: "Fashion photoshoot collage" },
  { src: "/giant-hand-reaching.jpg", alt: "Giant hand reaching from clouds" },
]

export function CommunityCreations() {
  return (
    <div className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Created by the Community
          </h2>
          <p className="text-lg text-muted-foreground">Powered by Soul</p>
          <Button>Share your generations</Button>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {communityImages.map((image, idx) => (
            <div key={idx} className="relative aspect-square">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/community">
            <Button size="lg" variant="outline">
              Show More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}