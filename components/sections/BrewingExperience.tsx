'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BrewingExperience() {
  return (
    <section className="relative h-[100vh] bg-luxury-black flex items-center justify-center overflow-hidden">
      {/* Top fade from black — zero gap from collection */}
      <div
        className="absolute top-0 left-0 w-full h-32 z-30 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #000000 0%, transparent 100%)" }}
      />
      
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/dark-brew-scene.jpg"
          alt="Cinematic brewing scene"
          fill
          className="object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_80%)]" />
      </div>

      <motion.div 
        animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[15%] z-10 w-24 h-24 blur-[2px]"
      >
      </motion.div>

      <div className="relative z-20 text-center max-w-2xl px-6">
        <h2 className="font-serif text-5xl md:text-7xl text-luxury-beige mb-6 drop-shadow-2xl">
          The Ritual
        </h2>
        <p className="font-sans text-luxury-sage mb-12 text-sm uppercase tracking-[0.2em]">
          Transforming water into liquid gold
        </p>
        
        {/* ADDED: suppressHydrationWarning to stop browser extensions from causing React errors */}
        <button 
          suppressHydrationWarning 
          className="relative group inline-flex items-center justify-center px-12 py-4 overflow-hidden border border-luxury-beige/30 hover:border-luxury-beige transition-colors duration-500 rounded-full"
        >
          <span className="absolute inset-0 w-full h-full bg-luxury-beige/5 group-hover:bg-luxury-beige/10 transition-colors duration-500" />
          <span className="relative font-sans text-xs uppercase tracking-[0.2em] text-luxury-beige">
            Discover the Process
          </span>
        </button>
      </div>
    </section>
  );
}