"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"

const allCommunityPosts = [
  // Add more posts to reach at least 32 for a 4x8 grid
  {
    id: 1,
    user: { name: "monet_burrito_2000", avatar: "/placeholder-user.jpg" },
    image: "/woman-orange-jacket-couch.jpg",
    prompt: "A woman in an orange jacket sitting on a couch.",
    category: "Soul ID",
  },
  {
    id: 2,
    user: { name: "art_explorer", avatar: "/placeholder-user.jpg" },
    image: "/dark-cinematic-raven-transformation.jpg",
    prompt: "A dark, cinematic transformation of a raven in a mysterious forest.",
    category: "Sora",
  },
  {
    id: 3,
    user: { name: "space_dreamer", avatar: "/placeholder-user.jpg" },
    image: "/astronaut-northern-lights-space.jpg",
    prompt: "An astronaut floating in space, surrounded by the vibrant colors of the northern lights.",
    category: "Veo 3.1",
  },
  {
    id: 4,
    user: { name: "mountain_lover", avatar: "/placeholder-user.jpg" },
    image: "/cinematic-sunset-mountains.jpg",
    prompt: "A breathtaking cinematic sunset over a majestic mountain range.",
    category: "Sora",
  },
  {
    id: 5,
    user: { name: "city_night_owl", avatar: "/placeholder-user.jpg" },
    image: "/urban-neon-city-night.jpg",
    prompt: "A vibrant neon city street at night, full of life and energy.",
    category: "Soul ID",
  },
  {
    id: 6,
    user: { name: "nature_enthusiast", avatar: "/placeholder-user.jpg" },
    image: "/wildlife-nature-documentary.jpg",
    prompt: "A stunning shot from a wildlife documentary, capturing the beauty of nature.",
    category: "Veo 3.1",
  },
  {
    id: 7,
    user: { name: "fashionista", avatar: "/placeholder-user.jpg" },
    image: "/fashion-photoshoot-collage.jpg",
    prompt: "A collage from a high-fashion photoshoot.",
    category: "Soul ID",
  },
  {
    id: 8,
    user: { name: "gamer_gfx", avatar: "/placeholder-user.jpg" },
    image: "/giant-hand-reaching.jpg",
    prompt: "A giant, ethereal hand reaching down from the clouds.",
    category: "Sora",
  },
  // Add more posts to fill the grid
  ...Array.from({ length: 24 }, (_, i) => ({
    id: i + 9,
    user: { name: `user_${i + 9}`, avatar: "/placeholder-user.jpg" },
    image: `/placeholder.jpg`,
    prompt: `This is a placeholder prompt for item ${i + 9}.`,
    category: ["Sora", "Veo 3.1", "Soul ID"][i % 3],
  })),
]

const filters = ["All", "Sora", "Veo 3.1", "Soul ID"]
const POSTS_PER_PAGE = 8

export default function CommunityPageClient() {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return allCommunityPosts
    }
    return allCommunityPosts.filter((post) => post.category === selectedCategory)
  }, [selectedCategory])

  const visiblePosts = filteredPosts.slice(0, visibleCount)

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredPosts.length) {
          setLoading(true)
          setTimeout(() => {
            setVisibleCount((prevCount) => prevCount + POSTS_PER_PAGE)
            setLoading(false)
          }, 500) // Simulate network delay
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, visibleCount, filteredPosts.length]
  )

  return (
    <>
      <div className="flex justify-center gap-2 mb-8">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={selectedCategory === filter ? "default" : "outline"}
            onClick={() => {
              setSelectedCategory(filter)
              setVisibleCount(POSTS_PER_PAGE) // Reset visible count on filter change
            }}
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visiblePosts.map((post, index) => (
          <div
            key={post.id}
            ref={index === visiblePosts.length - 1 ? lastPostElementRef : null}
          >
            <Link href={`/community/${post.id}`}>
              <div className="group relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt={post.prompt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={post.user.avatar}
                      alt={post.user.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <p className="text-sm font-medium text-white">{post.user.name}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center mt-12">
          <Spinner className="w-8 h-8" />
        </div>
      )}
    </>
  )
}