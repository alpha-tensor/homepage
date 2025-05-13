import React from "react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const stepsData: Step[] = [
  {
    number: "1",
    title: "Open-Source Development",
    description:
      "We create and maintain Apache 2.0-licensed alternatives to popular enterprise SaaS products.",
  },
  {
    number: "2",
    title: "Flat-Rate Hosting",
    description:
      "We offer simple, predictable pricing for hosted versions of our open-source software.",
  },
  {
    number: "3",
    title: "Sustainable Ecosystem",
    description:
      "Hosting revenue funds continued open-source development, creating a virtuous cycle.",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      {/* Changed bg-gray-50 for slight differentiation from other sections if needed */}
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
          {stepsData.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-700">
                {step.title}
              </h3>
              <p className="text-base text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;