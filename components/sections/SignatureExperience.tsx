'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SignatureExperience() {
  return (
    <section className="relative py-32 md:py-48 bg-luxury-black overflow-hidden px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
        
        <div className="relative h-[60vh] md:h-[80vh] w-full">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-10 left-0 w-3/4 h-[70%] rounded-sm overflow-hidden z-10 shadow-premium bg-luxury-teal/20"
          >
            {/* Make sure collection-1.jpg exists in public/images! */}
            <Image src="/images/collection-1.jpg" alt="Signature roast" fill className="object-cover" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="absolute bottom-10 right-0 w-2/3 p-8 bg-luxury-teal/30 backdrop-blur-xl border border-luxury-teal/40 z-20 shadow-glass"
          >
            <span className="font-sans text-[10px] uppercase tracking-widest text-luxury-sage mb-2 block">
              The Signature
            </span>
            <h3 className="font-serif text-3xl text-luxury-beige mb-4">Midnight Canopy</h3>
            <p className="font-sans text-sm text-luxury-sage font-light">
              A deeply resonant profile forged in the shadows of the highest altitudes. Notes of dark cacao, smoked fig, and raw wild honey.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-luxury-beige mb-8">
              A study in <br/> absolute refinement.
            </h2>
            <p className="font-sans text-luxury-sage font-light leading-relaxed max-w-lg mb-12">
              We approach coffee as an artisanal medium. Every bean is hand-selected, every roast profile meticulously charted, and every cup a testament to an uncompromising pursuit of perfection. This is not merely coffee; it is a curated sensory experience.
            </p>
            
            <button className="self-start font-sans text-xs uppercase tracking-[0.2em] text-luxury-beige border-b border-luxury-beige/30 pb-2 hover:border-luxury-beige hover:pr-4 transition-all duration-500">
              Explore the Origins
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}