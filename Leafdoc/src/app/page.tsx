
"use client";

import HeroSection from "@/components/sections/HeroSection";
import FeatureCard from "@/components/ui/FeatureCard";
import { Leaf, ShieldCheck, BookOpen, Lightbulb, Sprout, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const features = [
  {
    icon: Leaf,
    title: "Instant Plant ID",
    description: "Snap a photo, and our AI will identify the plant species with remarkable accuracy. Say goodbye to guesswork!",
  },
  {
    icon: ShieldCheck,
    title: "Disease Detection",
    description: "Upload an image of a symptomatic plant. LeafDoc's AI analyzes it to detect potential diseases and offers insights.",
  },
  {
    icon: BookOpen,
    title: "Expert Care Guides",
    description: "Access concise, easy-to-follow care information for your identified plants, covering watering, sunlight, and more.",
  },
];

const howItWorksSteps = [
  {
    icon: Lightbulb,
    title: "Upload or Snap",
    description: "Take a clear picture of your plant or its affected area using your phone or upload an existing image.",
    imageSrc: "https://placehold.co/600x400/d1fae5/10b981.png?text=Step+1",
    imageAlt: "Illustration of uploading a plant photo",
    dataAiHint: "upload interface",
  },
  {
    icon: Sprout,
    title: "AI Analysis",
    description: "Our intelligent system processes the image, identifying the plant or detecting signs of disease within seconds.",
    imageSrc: "https://placehold.co/600x400/ccfbf1/0d9488.png?text=Step+2",
    imageAlt: "Illustration of AI analyzing plant image",
    dataAiHint: "ai analysis",
  },
  {
    icon: MessageSquareHeart,
    title: "Get Results & Care",
    description: "Receive detailed information about your plant, potential issues, and tailored care advice to help it thrive.",
    imageSrc: "https://placehold.co/600x400/a7f3d0/059669.png?text=Step+3",
    imageAlt: "Illustration of plant care results",
    dataAiHint: "plant care",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose LeafDoc?</h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              LeafDoc combines advanced AI with a user-friendly interface to make plant care simple and effective for everyone.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">How LeafDoc Works</h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting started with LeafDoc is as easy as 1-2-3.
            </p>
          </motion.div>
          <div className="space-y-16">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="md:w-1/2">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                <div className="md:w-1/2">
                  <Image
                    src={step.imageSrc}
                    alt={step.imageAlt}
                    width={600}
                    height={400}
                    className="rounded-xl shadow-2xl object-cover aspect-video"
                    data-ai-hint={step.dataAiHint}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Nurture Your Plants?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl mb-10 max-w-xl mx-auto"
          >
            Join thousands of plant lovers who trust LeafDoc. Start identifying and caring for your plants like a pro today!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-6 bg-background text-primary hover:bg-background/90 rounded-lg shadow-xl transition-transform hover:scale-105">
              <Link href="/app">Explore LeafDoc App</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
