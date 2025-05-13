import React from "react";

const PitchSection: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-8">
          Alpha Tensor — Open SaaS for the AI Era
        </h2>
        <p className="text-muted-foreground md:text-lg max-w-[800px] mb-8">
          We’re replacing the SaaS monopoly stack — Notion, Airtable, Palantir,
          Salesforce — with fast, modern, open-source alternatives.
        </p>

        <h3 className="text-xl font-semibold text-foreground mb-4">Why Now:</h3>
        <ul className="list-disc list-inside text-muted-foreground mb-8">
          <li>Enterprises are demanding AI-native workflows.</li>
          <li>Dev teams want ownership, privacy, and cost control.</li>
          <li>
            Open-source infrastructure is no longer optional — it’s strategic.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-foreground mb-4">
          What We’ve Built:
        </h3>
        <ul className="list-disc list-inside text-muted-foreground mb-8">
          <li>Velar — a Palantir alternative for secure analytics</li>
          <li>Gridform — an Airtable alternative with AI-powered data input</li>
          <li>Leadpoint — a CRM without per-seat pricing</li>
          <li>Memex — a Notion-like workspace that lives in your infra</li>
        </ul>

        <h3 className="text-xl font-semibold text-foreground mb-4">
          Our Model:
        </h3>
        <ul className="list-disc list-inside text-muted-foreground mb-8">
          <li>Apache-licensed core, free and self-hostable</li>
          <li>Flat-rate SaaS for teams that want hosted versions</li>
          <li>Community-first, developer-focused growth</li>
        </ul>
        <blockquote className="italic text-muted-foreground border-l-4 border-primary pl-4 py-2 mt-8">
          We’re not just cloning SaaS tools — we’re redesigning them for
          control, speed, and sustainability.
        </blockquote>
        <p className="mt-8 text-lg text-foreground">
          Let’s build the new default stack.
        </p>
      </div>
    </section>
  );
};

export default PitchSection;
