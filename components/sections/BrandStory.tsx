'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function BrandStory() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  // Smoother, slightly shorter parallax travel distances
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section ref={container} id="story" className="relative py-32 md:py-48 bg-luxury-black overflow-hidden">
      {/* OPTIMIZATION 1: Replaced heavy CSS blur with a cheap radial-gradient */}
      <div className="absolute top-1/2 left-1/4 w-[40vw] h-[40vw] bg-[radial-gradient(circle,rgba(26,60,64,0.15)_0%,transparent_70%)] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
        
        <div className="lg:col-span-6 relative h-[70vh] md:h-[90vh] w-full overflow-hidden bg-luxury-black">
          {/* OPTIMIZATION 2: Added will-change-transform to force GPU acceleration */}
          <motion.div style={{ y: imgY }} className="absolute inset-0 h-[120%] -top-[10%] will-change-transform">
            {/* OPTIMIZATION 3: Removed live CSS filters (sepia/contrast) and used simple opacity */}
            <Image 
              src="/images/heritage-pour.jpg" 
              alt="Artisanal pour over"
              fill
              className="object-cover opacity-70"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Added a simple overlay to keep it moody without heavy filters */}
            <div className="absolute inset-0 bg-luxury-black/20" />
          </motion.div>
        </div>

        <motion.div style={{ y: textY }} className="lg:col-span-5 lg:col-start-8 z-10 will-change-transform">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-luxury-sage border-b border-luxury-sage/30 pb-2 mb-8 inline-block">
            Our Heritage
          </span>
          <h2 className="font-serif text-5xl md:text-7xl leading-[1.05] text-luxury-beige mb-10">
            Time is our most vital ingredient.
          </h2>
          <div className="space-y-6 text-luxury-sage font-sans text-sm md:text-base font-light leading-relaxed">
            <p>
              True luxury cannot be rushed. It is born in the high-altitude mists of untouched canopies and perfected through decades of relentless dedication to the craft.
            </p>
            <p>
              We view roasting not as a mechanical process, but as an intimate dialogue with the bean. A precise choreography of heat, airflow, and intuition designed to unlock a narrative hidden within.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}