import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Download, MoreHorizontal } from "lucide-react"
import Image from "next/image"

// Mock data - in a real app, you'd fetch this based on the `id` param
const communityPost = {
  id: 1,
  user: { name: "monet_burrito_2000", avatar: "/placeholder-user.jpg" },
  image: "/woman-orange-jacket-couch.jpg",
  prompt:
    "Harsh, stark lighting casts an angular shadow across an industrial space lined with white brick walls and exposed wiring, their raw textures contrasting with the smooth concrete floor underfoot. A young woman with long, straight platinum blonde hair kneels facing a large wall entirely covered with sleek black speaker cabinets and interspersed with several old-style TVs mounted on the wall. Her posture is reverent, as if praying to the altar of sound and vision before her.",
}

export default async function CommunityPostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative aspect-[4/3]">
            <Image
              src={communityPost.image}
              alt={communityPost.prompt}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={communityPost.user.avatar} />
                  <AvatarFallback>{communityPost.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{communityPost.user.name}</p>
                  <p className="text-sm text-muted-foreground">Higgsfield Soul</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Prompt</h2>
              <p className="text-muted-foreground">{communityPost.prompt}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="lg" className="flex-1">
                <Heart className="w-5 h-5 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <MessageCircle className="w-5 h-5 mr-2" />
                Comment
              </Button>
            </div>
            <Button size="lg" className="w-full">
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>
            <div className="space-y-2">
              <Button variant="link" className="p-0 h-auto">
                Animate
              </Button>
              <Button variant="link" className="p-0 h-auto">
                Edit
              </Button>
              <Button variant="link" className="p-0 h-auto">
                Upscale
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}