
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 text-foreground py-20 md:py-32 lg:py-40 overflow-hidden">
      {/* Decorative background elements - optional */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://placehold.co/1920x1080/e2f0e6/a8d5ba.png?text=Lush+Leaves" // Placeholder for a subtle background image
          alt="Lush leaves background"
          layout="fill"
          objectFit="cover"
          quality={75}
          priority
          data-ai-hint="botanical pattern"
        />
      </div>
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm"></div> {/* Subtle blur overlay */}


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6"
        >
          Discover the World of <span className="text-primary">Plants</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-700"
        >
          LeafDoc helps you identify plants, diagnose diseases, and learn how to care for your green companions with cutting-edge AI.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg transition-transform hover:scale-105">
            <Link href="/app">Get Started Free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
