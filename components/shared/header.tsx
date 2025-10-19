import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="80" height="80" viewBox="0 0 80 80" className="size-8 text-foreground group-hover:text-accent transition-colors" data-sentry-element="LogoFillIcon" data-sentry-source-file="header.tsx"><rect width="80" height="80" rx="16" fill="currentColor"></rect><path d="M64.2786 39.6003L64.2323 39.0943C63.7939 34.2383 60.6336 25.102 51.8677 25.102C45.3627 25.102 40.4487 31.5229 36.112 37.1838C32.6515 41.7173 29.6533 45.6063 26.3542 45.6063C25.4773 45.5146 24.3472 45.0772 23.6555 44.0877C23.0326 43.1898 22.8712 42.0393 23.1939 40.6585C23.7011 38.4722 26.6081 36.447 29.6758 34.2838C31.3594 33.1333 33.09 31.9135 34.2895 30.7399C37.75 27.4031 39.5031 24.9866 39.5031 21.0976C39.5031 17.2087 37.3579 15.2751 35.5585 14.4465C31.9598 12.79 26.6775 13.7564 23.3096 16.6565C22.8024 17.117 22.2946 17.5537 21.833 17.968C18.442 20.9828 16.1586 23.0312 10.9219 21.4657V27.7712C17.8653 30.8322 23.7018 24.9866 25.9164 22.2943C27.6232 20.5223 29.4225 19.4866 30.7609 19.4866H30.8304C31.4302 19.5097 31.9374 19.7399 32.307 20.1542C32.9068 20.8449 33.1376 21.6504 33.0219 22.5476C32.7679 24.4351 30.8072 26.6437 27.2085 29.0602C22.9869 31.891 15.9284 36.6317 15.3743 42.5921C14.959 46.8729 17.1736 51.1531 20.6341 52.8096C28.7077 56.63 33.6216 50.0481 38.8345 43.0981C42.8253 37.736 46.6085 32.6504 51.8684 32.6504C56.5972 32.6504 58.3502 36.5624 58.3502 39.0251V39.5086L57.8887 39.6003C46.424 41.6256 40.1723 52.3498 40.1723 57.2976C40.1723 62.2454 44.3708 66.48 49.538 66.48C55.5821 66.48 63.0559 61.3251 64.2555 46.8267L64.3017 46.2977H69.0769V39.601H64.2786V39.6003ZM58.0269 47.0332C57.1044 55.709 52.652 59.7596 49.9533 59.7596C48.7306 59.7596 47.0238 58.7469 47.0238 56.8602C47.0238 54.7432 50.1841 48.3223 57.2889 46.4125L58.1194 46.2053L58.0269 47.0339V47.0332Z" fill="#131313"></path></svg>
            <span className="text-body-m font-grotesk font-bold">Higgsfield</span>
          </Link>
          <nav className="hidden md:flex items-center gap-3">
            <Link
              href="/generate"
              className="relative group"
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/50 hover:border-violet-500 hover:bg-violet-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="font-semibold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                  Pro Mode
                </span>
              </Button>
            </Link>
            <Link
              href="/"
              className="relative group"
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/20 transition-all"
              >
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Lite Mode
                </span>
              </Button>
            </Link>
            <Link
              href="/community"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Community
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}