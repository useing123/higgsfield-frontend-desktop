"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, X, Info } from "lucide-react"
import { Footer } from "@/components/shared/footer"
import { cn } from "@/lib/utils"

interface Plan {
  name: string;
  price: number;
  originalPrice: number | null;
  credits: string;
  features: { text: string; tag?: string }[];
  isTopChoice: boolean;
  isSpecialOffer: boolean;
}

interface Faq {
  question: string;
  answer: string;
}

interface PricingPageClientProps {
  plans: {
    monthly: Plan[];
    annually: Plan[];
  };
  faqs: Faq[];
}

export default function PricingPageClient({ plans, faqs }: PricingPageClientProps) {
  const [isAnnual, setIsAnnual] = useState(false)
  const currentPlans = isAnnual ? plans.annually : plans.monthly

  return (
    <div className="bg-black text-white min-h-screen">
      <main>
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">Pick your plan</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get access to more generations and priority access to new features
            </p>
            <div className="mt-10 flex items-center justify-center gap-2 bg-[#1C1C1C] p-1 rounded-full w-fit mx-auto">
              <Button
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "rounded-full px-6",
                  !isAnnual ? "bg-gray-600 text-white" : "bg-transparent text-gray-400"
                )}
              >
                Monthly
              </Button>
              <Button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "rounded-full px-6 relative",
                  isAnnual ? "bg-gray-600 text-white" : "bg-transparent text-gray-400"
                )}
              >
                Annual
                <span className="absolute -top-2 -right-4 bg-primary text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  SAVE 40%
                </span>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {currentPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    "bg-[#1C1C1C] border rounded-2xl p-6 flex flex-col",
                    {
                      "border-primary": plan.isTopChoice,
                      "border-pink-500": plan.isSpecialOffer,
                      "border-gray-700": !plan.isTopChoice && !plan.isSpecialOffer,
                    }
                  )}
                >
                  <CardHeader className="p-0 mb-6">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      {plan.isTopChoice && (
                        <div className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                          TOP CHOICE
                        </div>
                      )}
                      {plan.isSpecialOffer && (
                        <div className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          SPECIAL OFFER
                        </div>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                      {plan.originalPrice && (
                        <span className="text-3xl font-bold text-gray-500 line-through">
                          ${plan.originalPrice}
                        </span>
                      )}
                      <span className="text-5xl font-bold">${plan.price}</span>
                      <span className="text-gray-400">/mo</span>
                    </div>
                    <p className="text-sm text-gray-400">Billed {isAnnual ? "annually" : "monthly"}</p>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow flex flex-col">
                    <Button
                      className={cn("w-full text-lg h-12", {
                        "bg-primary text-black hover:bg-primary/90": plan.isTopChoice,
                        "bg-white text-black hover:bg-gray-200": !plan.isTopChoice,
                      })}
                    >
                      Select Plan
                    </Button>
                    <div className="space-y-3 mt-8 flex-grow">
                      <p className="font-semibold flex items-center gap-2">
                        {plan.credits} <Info className="w-4 h-4 text-gray-400" />
                      </p>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="flex-1">{feature.text}</span>
                          {feature.tag && (
                            <span
                              className={cn("text-xs font-bold px-2 py-0.5 rounded-full", {
                                "bg-yellow-300 text-black": feature.tag.includes("UNLIMITED"),
                                "bg-green-300 text-black": feature.tag.includes("OFF"),
                              })}
                            >
                              {feature.tag}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-gray-800">
                  <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-400">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}