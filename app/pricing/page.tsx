
import { Suspense } from "react"
import PricingPageClient from "@/components/pricing/PricingPageClient"

const plans = {
  monthly: [
    {
      name: "Basic",
      price: 9,
      originalPrice: null,
      credits: "150 credits/month",
      features: [
        { text: "2 concurrent generations" },
        { text: "Higgsfield Soul & Character Creation" },
        { text: "Video Models: Lite, Standard, Turbo, Veo3, Seedance Pro, Kling 2.1, Kling 2.5, Vian 2.2, Vian 2.5" },
        { text: "Image & video upscaling features" },
      ],
      isTopChoice: false,
      isSpecialOffer: false,
    },
    {
      name: "Pro",
      price: 29,
      originalPrice: null,
      credits: "600 credits/month",
      features: [
        { text: "3 concurrent generations" },
        { text: "Soul, Character Creation" },
        { text: "Video Models: Lite, Standard, Turbo, Veo3, Hailun 02, Seedance Pro, Kling 2.1, Kling 2.5, Vian 2.2, Vian 2.5, Sora 2, Veo 3.1" },
        { text: "Image-editing features" },
        { text: "Start & End Frame control" },
        { text: "Preview upcoming features" },
        { text: "Higgsfield Animate, Lipsync Studio" },
        { text: "Google Veo3", tag: "75% OFF" },
        { text: "Google Nano Banana", tag: "365 UNLIMITED" },
        { text: "Seedream 4.0", tag: "365 UNLIMITED" },
      ],
      isTopChoice: true,
      isSpecialOffer: false,
    },
    {
      name: "Ultimate",
      price: 49,
      originalPrice: null,
      credits: "1200 credits/month",
      features: [
        { text: "4 concurrent generations" },
        { text: "Soul, Character Creation" },
        { text: "Video Models: Lite, Standard, Turbo, Veo3, Hailun 02, Seedance Pro, Kling 2.1, Kling 2.5, Vian 2.2, Vian 2.5, Sora 2, Veo 3.1" },
        { text: "Image-editing features" },
        { text: "Start & End Frame control" },
        { text: "Preview upcoming features" },
        { text: "Higgsfield Animate, Lipsync Studio" },
        { text: "Google Veo3", tag: "75% OFF" },
        { text: "Google Nano Banana", tag: "365 UNLIMITED" },
        { text: "Seedream 4.0", tag: "365 UNLIMITED" },
        { text: "Sora 2, Sora 2 Max", tag: "UNLIMITED" },
      ],
      isTopChoice: false,
      isSpecialOffer: false,
    },
  ],
  annually: [
    {
      name: "Basic",
      price: 5.4,
      originalPrice: 9,
      credits: "150 credits/month",
      features: [
        { text: "2 concurrent generations" },
        { text: "Higgsfield Soul & Character Creation" },
        { text: "Video Models: Lite, Standard, Turbo, Veo3, Seedance Pro, Kling 2.1, Kling 2.5, Vian 2.2, Vian 2.5" },
        { text: "Image & video upscaling features" },
      ],
      isTopChoice: false,
      isSpecialOffer: false,
    },
    {
      name: "Pro",
      price: 17.4,
      originalPrice: 29,
      credits: "600 credits/month",
      features: [
        { text: "3 concurrent generations" },
        { text: "Soul, Character Creation" },
        { text: "Video Models: Lite, Standard, Turbo, Veo3, Hailun 02, Seedance Pro, Kling 2.1, Kling 2.5, Vian 2.2, Vian 2.5, Sora 2, Veo 3.1" },
        { text: "Image-editing features" },
        { text: "Start & End Frame control" },
        { text: "Preview upcoming features" },
        { text: "Higgsfield Animate, Lipsync Studio" },
        { text: "Google Veo3", tag: "75% OFF" },
        { text: "Google Nano Banana", tag: "365 UNLIMITED" },
        { text: "Seedream 4.0", tag: "365 UNLIMITED" },
      ],
      isTopChoice: true,
      isSpecialOffer: false,
    },
    {
      name: "Ultimate",
      price: 29.4,
      originalPrice: 49,
      credits: "1200 credits/month",
      features: [
        { text: "4 concurrent generations" },
        { text: "Soul, Character Creation" },
        { text: "Video Models: Lite, Standard, Turbo, Veo3, Hailun 02, Seedance Pro, Kling 2.1, Kling 2.5, Vian 2.2, Vian 2.5, Sora 2, Veo 3.1" },
        { text: "Image-editing features" },
        { text: "Start & End Frame control" },
        { text: "Preview upcoming features" },
        { text: "Higgsfield Animate, Lipsync Studio" },
        { text: "Google Veo3", tag: "75% OFF" },
        { text: "Google Nano Banana", tag: "365 UNLIMITED" },
        { text: "Seedream 4.0", tag: "365 UNLIMITED" },
        { text: "Sora 2, Sora 2 Max", tag: "UNLIMITED" },
      ],
      isTopChoice: false,
      isSpecialOffer: false,
    },
  ],
}

const faqs = [
  {
    question: "What Are Credits?",
    answer:
      "Credits are the cost unit for media generation. The number of credits required depends on the complexity of the media. Higgsfield Speak video generation costs 20-50 credits, based on duration. Voice and sound generation is 1 credit. Higgsfield Soul Image costs 0.25 credits, GPT Image costs 1-5 credits (Low: 1, Medium: 2, High: 5), Flux Kontextt Max costs 1.5 credits and Higgsfield Canvas costs 0.25 credit. Video cost depends on the selected model, steps, and duration.",
  },
  {
    question: "How do I get more credits?",
    answer: "You can purchase more credits at any time from your account dashboard.",
  },
  {
    question: "Do unused credits roll over to the next month?",
    answer: "Unused credits do not roll over. Your credit balance resets at the beginning of each billing cycle.",
  },
  {
    question: "Can I change my plan after purchasing one?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. The changes will take effect in the next billing cycle.",
  },
  {
    question: "How can I contact Higgsfield?",
    answer: "You can contact us through our support page or by emailing support@higgsfield.ai.",
  },
]

export default function PricingPage() {
  return (
    <Suspense>
      <PricingPageClient plans={plans} faqs={faqs} />
    </Suspense>
  )
}
