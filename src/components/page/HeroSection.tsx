import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden ">
      {/* Added relative and overflow-hidden for blob */}
      <div className="container px-4 md:px-6">
        {/* Hero Content Wrapper */}
        <div className="relative">
          <div
            className="absolute right-0 top-20 h-[200px] w-[350px] animate-pulse rounded-full bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-200 opacity-70 blur-3xl"
            aria-hidden="true"
          />
          {/* Positioning context */}
          {/* Original Headline - Ensure text-foreground */}
          <h1 className="max-w-3xl text-6xl font-light leading-tight tracking-tight text-foreground">
            {/* Added text-foreground */}
            We Build for the community.
            <br />
            Building Tools to Solve Problems, Not Just for Profit.
          </h1>
          <div className="mt-24 flex flex-col sm:flex-row justify-between gap-6">
            {/* Use flex-col on small, flex-row on medium+, add gap */}
            <div className="max-w-md flex-grow">
              {/* Button - Use primary color for border and text */}
              <Button
                variant="outline"
                className="rounded-full border-2 px-8 text-primary border-primary hover:bg-primary h-auto py-3 relative overflow-hidden "
              >
                {/* Updated classes */}
                <span className="relative z-10">
                  {/* z-10 to keep text above spinning border */}
                  Talk to Us {/* Kept original button text */}
                </span>
                {/* Spinning Border - Use primary color */}
                {/* Position absolutely within the relative button */}
                <div className="absolute inset-0 animate-spin-slow rounded-full border border-primary opacity-50"></div>{" "}
                {/* Use border-primary */}
              </Button>
              {/* First Paragraph below button - Use muted-foreground */}
            </div>
            {/* "WHO WE ARE" text and line - Use theme colors */}
            <div className="flex items-end">
              {/* Container for the text and line */}
              <div className="flex items-center space-x-2 text-foreground">
                {/* Added text-foreground */}
                <span className="text-sm">WHO WE ARE</span>{" "}
                {/* Uses text-foreground */}
                <span className="h-px w-12 bg-border"></span>{" "}
                {/* Use bg-border */}
              </div>
            </div>
          </div>
          {/* Second Paragraph below button - Adjusted copy, use muted-foreground */}
          <p className="mt-24 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {/* Use text-muted-foreground */}
            We build transparent, community-backed alternatives to closed
            platforms — whether you're managing data, leads, workflows, or
            knowledge.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
