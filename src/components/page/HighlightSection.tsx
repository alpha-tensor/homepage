import React from "react";
import { Brain, Wrench, Server, BadgeDollarSign } from "lucide-react";

const HighlightSection: React.FC = () => {
  return (
    <section className="bg-orange-500 text-white py-16">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Built for Control.
            <br />
            Designed for Speed.
          </h2>
          <p className="text-lg leading-relaxed max-w-xl">
            No lock-in. No per-user pricing. Just powerful, open tools for
            modern teams — backed by a thriving community and flat-rate hosting.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:justify-end">
          <div className="flex items-center space-x-3">
            <Brain className="h-7 w-7" />
            <span className="text-sm font-medium">AI-native</span>
          </div>
          <div className="flex items-center space-x-3">
            <Wrench className="h-7 w-7" />
            <span className="text-sm font-medium">Developer-first</span>
          </div>
          <div className="flex items-center space-x-3">
            <Server className="h-7 w-7" />
            <span className="text-sm font-medium">Self-hostable</span>
          </div>
          <div className="flex items-center space-x-3">
            <BadgeDollarSign className="h-7 w-7" />
            <span className="text-sm font-medium">Flat pricing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightSection;
