'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Consume global cart state
  const { cart, setIsCartOpen } = useCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        isScrolled ? 'bg-luxury-black/80 backdrop-blur-md border-b border-luxury-teal/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
        <nav className="hidden md:flex gap-8 font-sans text-xs tracking-[0.2em] uppercase text-luxury-beige/70">
          <Link href="#collection" className="hover:text-luxury-beige transition-colors">Collection</Link>
          <Link href="#story" className="hover:text-luxury-beige transition-colors">Heritage</Link>
        </nav>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="font-serif text-2xl tracking-widest text-luxury-beige">
            L'ESSENCE
          </span>
        </Link>

        <nav className="hidden md:flex gap-8 items-center font-sans text-xs tracking-[0.2em] uppercase text-luxury-beige/70">
          <Link href="/journal" className="hover:text-luxury-beige transition-colors">Journal</Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-luxury-beige border-b border-luxury-beige/30 pb-1 hover:border-luxury-beige transition-colors cursor-pointer animate-none"
          >
            Cart ({totalCount})
          </button>
        </nav>

        <button className="md:hidden flex flex-col gap-1.5 z-50">
          <div className="w-6 h-[1px] bg-luxury-beige" />
          <div className="w-6 h-[1px] bg-luxury-beige" />
        </button>
      </div>
    </motion.header>
  );
}