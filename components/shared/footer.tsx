import Link from "next/link"

const footerLinks = {
  "Higgsfield AI": [
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Apps", href: "#" },
    { name: "Community", href: "#" },
    { name: "Copilot", href: "#" },
    { name: "Reference Extension", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Ambassador Program", href: "#" },
    { name: "Discord", href: "#" },
  ],
  Image: [
    { name: "Create Image", href: "#" },
    { name: "Soul ID Character", href: "#" },
    { name: "Draw to Edit", href: "#" },
    { name: "Fashion Factory", href: "#" },
    { name: "Edit Image", href: "#" },
    { name: "Image Upscale", href: "#" },
    { name: "Photodump Studio", href: "#" },
  ],
  Video: [
    { name: "Sora 2 Introduction", href: "#" },
    { name: "Sora 2 AI Video Presets", href: "#" },
    { name: "Veo 3.1 Introduction", href: "#" },
    { name: "Veo 3.1 AI Video Presets", href: "#" },
    { name: "Shorts Generator", href: "#" },
    { name: "YouTube Generator", href: "#" },
    { name: "Reels Generator", href: "#" },
    { name: "TikTok Generator", href: "#" },
    { name: "Create Video", href: "#" },
    { name: "Lipsync Studio", href: "#" },
    { name: "Talking Avatar", href: "#" },
    { name: "Draw to Video", href: "#" },
    { name: "UGC Factory", href: "#" },
    { name: "Video Upscale", href: "#" },
  ],
  Edit: [
    { name: "Banana Placement", href: "#" },
    { name: "Product Placement", href: "#" },
    { name: "Edit Image", href: "#" },
    { name: "Multi Reference", href: "#" },
    { name: "Upscale", href: "#" },
    { name: "Sora 2 Upscale", href: "#" },
  ],
}

const socialLinks = [
  { name: "X / Twitter", href: "#" },
  { name: "Youtube", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "LinkedIn", href: "#" },
  { name: "Tiktok", href: "#" },
]

const legalLinks = [
  { name: "Creative Challenge", href: "#" },
  { name: "Cookie Notice", href: "#" },
  { name: "Terms", href: "#" },
  { name: "Privacy", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-primary text-black">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold max-w-xs">
              THE ULTIMATE AI-POWERED CAMERA CONTROL FOR FILMMAKERS & CREATORS
            </h2>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:underline">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-black/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-left mb-4 md:mb-0">535 Mission St, 14th floor, San Francisco, CA, 94105</p>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm hover:underline">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">&copy; 2025 Higgsfield AI™. All rights reserved.</p>
          <div className="flex gap-4">
            {legalLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm hover:underline">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}