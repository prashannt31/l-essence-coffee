'use client';

import { motion } from 'framer-motion';

export default function Newsletter() {
  return (
    <section className="py-32 bg-luxury-teal/10 border-y border-luxury-teal/20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-luxury-sage mb-4 block">
            The Inner Circle
          </span>
          <h2 className="font-serif text-4xl text-luxury-beige mb-6">
            Join the L'Essence Society
          </h2>
          <p className="font-sans text-sm text-luxury-sage font-light mb-12">
            Receive priority access to limited-reserve roasts, private tasting events, and curatorial insights.
          </p>
          
          <form className="relative flex max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full bg-transparent border-b border-luxury-sage/30 px-0 py-4 text-luxury-beige font-sans text-sm focus:outline-none focus:border-luxury-beige transition-colors placeholder:text-luxury-sage/40"
              required
            />
            <button 
              type="submit"
              className="absolute right-0 bottom-4 font-sans text-xs uppercase tracking-widest text-luxury-beige hover:text-luxury-sage transition-colors"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}