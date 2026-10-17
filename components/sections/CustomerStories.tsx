'use client';

import { motion } from 'framer-motion';

const STORIES = [
  {
    quote: "A masterclass in restraint and flavor. L'Essence has completely redefined my morning ritual.",
    author: "Elena R.",
    role: "Culinary Director"
  },
  {
    quote: "The Midnight Canopy roast is profound. It feels less like a beverage and more like a work of art.",
    author: "Marcus T.",
    role: "Architect"
  }
];

export default function CustomerStories() {
  return (
    <section className="relative py-40 bg-luxury-teal px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-transparent to-luxury-black opacity-80" />
      
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <h2 className="font-serif text-4xl text-luxury-beige text-center mb-24">
          Echoes of the Ritual
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {STORIES.map((story, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-12 border border-luxury-sage/10 bg-luxury-black/20 backdrop-blur-md rounded-sm"
            >
              <span className="text-luxury-sage text-6xl font-serif leading-none absolute top-8 left-8 opacity-20">"</span>
              <p className="font-serif text-2xl md:text-3xl text-luxury-beige leading-snug mb-8 relative z-10">
                {story.quote}
              </p>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs uppercase tracking-widest text-luxury-beige">
                  {story.author}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-luxury-sage">
                  {story.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}