import React, { Suspense } from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/shared/header"
import { AnalyticsProvider } from "@/components/analytics-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Higgsfield AI - Turn Ideas into Viral Videos",
  description: "Create stunning AI-powered videos in minutes. Simple chat interface or full professional controls.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <Suspense>
          <AnalyticsProvider>
            <Header />
            {children}
            <Analytics />
          </AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  )
}
