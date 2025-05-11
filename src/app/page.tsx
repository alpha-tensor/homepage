import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Terminal,
  Grid,
  Users,
  Database,
  Github,
  ArrowRight,
  Check,
  Star,
  GitFork,
} from "lucide-react";
import HighlightSection from "@/components/page/HighlightSection";

import OurProductsSection from "@/components/page/OurProductsSection";
import HowItWorksSection from "@/components/page/HowItWorksSection";
import PricingSection from "@/components/page/PricingSection";
import Footer from "@/components/page/Footer";
import HeroSection from "@/components/page/HeroSection";
import PitchSection from "@/components/page/PitchSection";

import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section (Keeping original layout and blob) */}
        {/* Used original Hero section padding and container */}

        <HeroSection />

        <section>
          <HighlightSection />
        </section>

        {/* Products Section - Styling corrections */}
        <section id="products" className=" bg-gray-50 border-y">
          <OurProductsSection />
        </section>

        {/* How It Works Section - Styling corrections */}
        <section id="how-it-works" className="py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                How It Works
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-[800px]">
                We fund open-source development by offering simple, flat-rate
                hosting. No per-user fees. No vendor traps.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1, 2, 3 - Dark Cards */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-700">
                  Open-Source Development
                </h3>
                <p className="text-base text-gray-600">
                  We create and maintain Apache 2.0-licensed alternatives to
                  popular enterprise SaaS products.
                </p>
              </div>

              {/* Step 2 - Dark Card */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-700">
                  Flat-Rate Hosting
                </h3>
                <p className="text-base text-gray-600">
                  We offer simple, predictable pricing for hosted versions of
                  our open-source software.
                </p>
              </div>

              {/* Step 3 - Dark Card */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-700">
                  Sustainable Ecosystem
                </h3>
                <p className="text-base text-gray-600">
                  Hosting revenue funds continued open-source development,
                  creating a virtuous cycle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Styling corrections */}
        <section id="pricing" className="py-20 bg-gray-50 border-y">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Hobby Tier - Dark Card */}
              <Card className="flex flex-col h-full bg-gray-900 text-gray-100">
                <CardHeader>
                  <CardTitle className="text-white">Hobby</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                    <span className="text-primary">$19</span>
                    <span className="ml-1 text-xl font-medium text-gray-400">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>1 GB storage</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>100K API requests/month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Community support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Unlimited users</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Pro Tier - Dark Card */}
              <Card className="flex flex-col h-full bg-gray-900 text-gray-100">
                <CardHeader>
                  <CardTitle className="text-white">Pro</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                    <span className="text-primary">$49</span>
                    <span className="ml-1 text-xl font-medium text-gray-400">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>10 GB storage</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>500K API requests/month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Email support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Unlimited users</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Scale Tier - Dark Card with Border */}
              <Card className="flex flex-col h-full border-primary shadow-md relative before:absolute before:inset-0 before:border-2 before:border-primary before:rounded-lg before:pointer-events-none bg-gray-900 text-gray-100">
                <CardHeader>
                  <div className="py-1 px-3 text-xs font-medium bg-primary text-primary-foreground rounded-full w-fit mb-2">
                    Popular
                  </div>
                  <CardTitle className="text-white">Scale</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                    <span className="text-primary">$149</span>
                    <span className="ml-1 text-xl font-medium text-gray-400">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>50 GB storage</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>2M API requests/month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Unlimited users</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Enterprise Tier - Dark Card */}
              <Card className="flex flex-col h-full bg-gray-900 text-gray-100">
                <CardHeader>
                  <CardTitle className="text-white">Enterprise</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                    <span className="text-primary">$499</span>
                    <span className="ml-1 text-xl font-medium text-gray-400">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>250 GB storage</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>10M API requests/month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>24/7 dedicated support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Unlimited users</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Open Source Commitment Section - Styling corrections */}
        <section id="open-source" className="py-24 bg-gray-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6 text-white">
                  Our Open Source Commitment
                </h2>
                <p className="text-gray-300 mb-6">
                  All Alpha Tensor products are released under the Apache 2.0
                  license, giving you the freedom to:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white">
                        Use Commercially
                      </h3>
                      <p className="text-gray-300">
                        Deploy our software for commercial purposes without
                        licensing fees.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white">
                        Modify the Code
                      </h3>
                      <p className="text-gray-300">
                        Customize and extend our software to meet your specific
                        needs.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white">Self-Host</h3>
                      <p className="text-gray-300">
                        Run the software on your own infrastructure with
                        complete control.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white">
                        Contribute Back
                      </h3>
                      <p className="text-gray-300">
                        Join our community and help improve the software for
                        everyone.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              {/* GitHub Activity Card - Dark background, light text */}
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-sm text-gray-100">
                <div className="flex items-center mb-6">
                  <Github className="h-8 w-8 mr-3 text-white" />
                  <h3 className="text-xl font-bold text-white">
                    GitHub Activity
                  </h3>
                </div>
                <div className="space-y-4">
                  {/* GitHub Repo List */}
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="font-mono text-white">
                      alphatensor/velar
                    </span>
                    <div className="flex items-center text-sm">
                      <span className="mr-4 text-primary font-semibold">
                        ⭐ 2.4k
                      </span>
                      <span className="text-primary font-semibold">🍴 342</span>
                    </div>
                  </div>
                  {/* Repeat for other repos */}
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="font-mono text-white">
                      alphatensor/gridform
                    </span>
                    <div className="flex items-center text-sm">
                      <span className="mr-4 text-primary font-semibold">
                        ⭐ 1.8k
                      </span>
                      <span className="text-primary font-semibold">🍴 276</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="font-mono text-white">
                      alphatensor/leadpoint
                    </span>
                    <div className="flex items-center text-sm">
                      <span className="mr-4 text-primary font-semibold">
                        ⭐ 1.2k
                      </span>
                      <span className="text-primary font-semibold">🍴 198</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="font-mono text-white">
                      alphatensor/memex
                    </span>
                    <div className="flex items-center text-sm">
                      <span className="mr-4 text-primary font-semibold">
                        ⭐ 3.1k
                      </span>
                      <span className="text-primary font-semibold">🍴 487</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  {/* Button - Outline white on dark background */}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Github className="mr-2 h-4 w-4" /> View Our GitHub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Styling corrections */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-foreground">
                Build smarter. Own your stack.
              </h2>
              <p className="text-primary-foreground/80 md:text-lg max-w-[800px]">
                Join thousands of teams using Alpha Tensor to stay lean, fast,
                and free — with flat pricing and full control.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* "Get Started" Button - White with primary text */}
                <Button
                  size="lg"
                  className="font-medium bg-white text-primary hover:bg-white/90"
                >
                  Get Started
                </Button>
                {/* "Schedule a Demo" Button - Outline white on primary background */}
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/20 font-medium"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Styling corrections */}
      <footer className="border-t py-12 md:py-16 bg-background text-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xl font-bold tracking-tight text-primary">
                  α
                </span>
                <span className="font-sans text-xl font-bold tracking-tight text-foreground">
                  Alpha Tensor
                </span>
              </div>
              {/* Description */}
              <p className="text-muted-foreground text-sm mb-4">
                Open-source alternatives to enterprise SaaS with flat,
                predictable pricing.
              </p>
              {/* Social Icons (SVGs omitted for brevity but should be there) */}
              <div className="flex space-x-4 text-muted-foreground">
                {" "}
                {/* Applied text-muted-foreground here */}
                <Link href="#" className="hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  {/* SVG */}
                </Link>
                <Link href="#" className="hover:text-foreground">
                  <span className="sr-only">GitHub</span>
                  {/* SVG */}
                </Link>
                <Link href="#" className="hover:text-foreground">
                  <span className="sr-only">LinkedIn</span>
                  {/* SVG */}
                </Link>
              </div>
            </div>
            {/* Navigation Links */}
            <div>
              <h3 className="text-sm font-medium mb-4 text-foreground">
                Products
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Velar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Gridform
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Leadpoint
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Memex
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4 text-foreground">
                Resources
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4 text-foreground">
                Company
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Copyright and Legal Links */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2025 Alpha Tensor. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
