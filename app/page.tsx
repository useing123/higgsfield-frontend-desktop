import { Footer } from "@/components/shared/footer"
import { Hero } from "@/components/home/hero"
import { ChatInterface } from "@/components/home/chat-interface"
import { CommunityCreations } from "@/components/home/community-creations"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Hero />
            <ChatInterface />
          </div>
        </div>
        <CommunityCreations />
      </main>
      <Footer />
    </div>
  )
}
