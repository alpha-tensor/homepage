import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Terminal, Grid, Users, Database, ArrowRight } from "lucide-react";

const productsData = [
  {
    icon: <Terminal className="h-5 w-5 text-gray-500 mb-2" />,
    title: "Velar",
    description: "Open-source alternative to Palantir",
    content: "Advanced data analytics and visualization platform.",
    link: "#",
  },
  {
    icon: <Grid className="h-5 w-5 text-gray-500 mb-2" />,
    title: "Gridform",
    description: "Open-source alternative to Airtable",
    content: "No-code database and spreadsheet application.",
    link: "#",
  },
  {
    icon: <Users className="h-5 w-5 text-gray-500 mb-2" />,
    title: "Leadpoint",
    description: "Open-source alternative to Salesforce",
    content: "Customer relationship management and sales automation.",
    link: "#",
  },
  {
    icon: <Database className="h-5 w-5 text-gray-500 mb-2" />,
    title: "Memex",
    description: "Open-source alternative to Notion",
    content: "All-in-one workspace for notes, tasks, and wikis.",
    link: "#",
  },
];

const OurProductsSection: React.FC = () => {
  return (
    <section
      id="our-products"
      className="py-20 md:py-28 relative overflow-hidden "
    >
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
        {/* Left Column: Intro Text */}
        <div className="md:col-span-3">
          <h2 className="text-3xl font-bold leading-tight mb-4 font-inter">
            Our Products
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed font-work-sans">
            Open-source alternatives to the tools you rely on. Built for
            developers, businesses, and teams that want speed and sovereignty.
          </p>
        </div>

        {/* Right Column: Product Cards */}
        <div className="md:col-span1"></div>
        <div className="md:col-span-2 grid sm:grid-cols-4 gap-6">
          {productsData.map((product) => (
            <Card
              key={product.title}
              className="flex flex-col h-full rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader>
                {product.icon}
                <CardTitle className="text-lg font-semibold  font-space-grotesk">
                  {product.title}
                </CardTitle>
                <CardDescription className="text-sm  font-work-sans">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm  font-work-sans">{product.content}</p>
              </CardContent>
              <CardFooter>
                <Link
                  href={product.link}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurProductsSection;
