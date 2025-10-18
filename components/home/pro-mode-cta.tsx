import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function ProModeCTA() {
  return (
    <div className="pt-8">
      <Link href="/generate">
        <Button variant="outline" size="lg">
          Need more control? Try Pro Mode
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  )
}