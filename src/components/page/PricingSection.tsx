import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Assuming path for shadcn/ui Card
import { Button } from "@/components/ui/button"; // Assuming path for shadcn/ui Button
import { Check } from "lucide-react";

interface PricingTierFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  title: string;
  price: string;
  priceSuffix?: string;
  features: PricingTierFeature[];
  buttonText: string;
  buttonLink: string;
  isFeatured?: boolean; // For highlighting a specific tier
}

const pricingData: PricingTier[] = [
  {
    title: "Hobby",
    price: "$19",
    priceSuffix: "/month",
    features: [
      { text: "1 GB storage", included: true },
      { text: "100K API requests/month", included: true },
      { text: "Community support", included: true },
      { text: "Unlimited users", included: true },
    ],
    buttonText: "Get Started",
    buttonLink: "#",
  },
  {
    title: "Pro",
    price: "$49",
    priceSuffix: "/month",
    features: [
      { text: "10 GB storage", included: true },
      { text: "500K API requests/month", included: true },
      { text: "Priority email support", included: true },
      { text: "Unlimited users", included: true },
      { text: "Advanced analytics", included: true },
    ],
    buttonText: "Choose Pro",
    buttonLink: "#",
    isFeatured: true, // Example: Highlight the Pro tier
  },
  {
    title: "Business",
    price: "$99",
    priceSuffix: "/month",
    features: [
      { text: "50 GB storage", included: true },
      { text: "2M API requests/month", included: true },
      { text: "Dedicated support", included: true },
      { text: "Unlimited users", included: true },
      { text: "Custom integrations", included: true },
    ],
    buttonText: "Choose Business",
    buttonLink: "#",
  },
  {
    title: "Enterprise",
    price: "Custom",
    features: [
      { text: "Unlimited storage", included: true },
      { text: "Custom API rate limits", included: true },
      { text: "SLA & 24/7 support", included: true },
      { text: "Unlimited users", included: true },
      { text: "On-premise option", included: true },
    ],
    buttonText: "Contact Us",
    buttonLink: "#",
  },
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
            Flat Pricing
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-[800px]">
            Simple, predictable pricing with no per-user fees. Pay for
            resources, not seats.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {pricingData.map((tier) => (
            <Card
              key={tier.title}
              className={`flex flex-col h-full border shadow-sm rounded-lg transition-all duration-300 ${
                tier.isFeatured
                  ? "bg-primary text-primary-foreground ring-2 ring-primary shadow-xl -translate-y-2"
                  : "bg-card text-card-foreground hover:shadow-lg"
              }`}
            >
              <CardHeader className={`${tier.isFeatured ? "" : "text-foreground"}`}>
                <CardTitle className={`text-2xl font-semibold ${tier.isFeatured ? "" : "text-foreground"}`}>{tier.title}</CardTitle>
                <div className={`mt-4 flex items-baseline text-5xl font-extrabold ${tier.isFeatured ? "text-white" : "text-primary"}`}>
                  <span>{tier.price}</span>
                  {tier.priceSuffix && (
                    <span className={`ml-1 text-xl font-medium ${tier.isFeatured ? "text-gray-200" : "text-muted-foreground"}`}>
                      {tier.priceSuffix}
                    </span>
                  )}
                </div>
                {tier.title === "Enterprise" && (
                   <p className={`mt-1 text-sm ${tier.isFeatured ? "text-gray-200" : "text-muted-foreground"}`}>Tailored for your needs</p>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className={`space-y-3 ${tier.isFeatured ? "text-gray-200" : "text-muted-foreground"}`}>
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check
                        className={`mr-2 h-5 w-5 flex-shrink-0 mt-0.5 ${
                          tier.isFeatured ? "text-white" : "text-primary"
                        }`}
                      />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className={`w-full ${
                    tier.isFeatured
                      ? "bg-white text-primary hover:bg-gray-100"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  <Link href={tier.buttonLink}>{tier.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;