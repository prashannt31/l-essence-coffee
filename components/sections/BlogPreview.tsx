'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
// Assuming your modal is in the same folder or components folder
import ReserveModal from '../ReserveModal';
const ARTICLES = [
  {
    id: 1,
    title: "The Anatomy of a Perfect Extraction",
    category: "Technique",
    date: "Oct 12",
    image: "collection-2.jpg",
    isReserve: false
  },
  {
    id: 2,
    title: "Sourcing in the Clouds: Our Colombian Journey",
    category: "Origins",
    date: "Oct 08",
    image: "collection-4.jpg",
    isReserve: true // Trigger for the modal
  },
  {
    id: 3,
    title: "Why Water Temperature is Your Greatest Asset",
    category: "Science",
    date: "Sep 28",
    image: "heritage-pour.jpg",
    isReserve: false
  }
];

export default function BlogPreview() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-32 bg-luxury-black px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end mb-16">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-luxury-sage mb-4 block">
            The Journal
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-luxury-beige">
            Notes on Craft
          </h2>
        </div>
        <Link href="/journal" className="hidden md:inline-block font-sans text-xs uppercase tracking-[0.2em] text-luxury-beige border-b border-luxury-beige/30 pb-2 hover:border-luxury-beige transition-all">
          Read All Entries
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {ARTICLES.map((article, idx) => (
          <motion.div 
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: idx * 0.2 }}
            className="group cursor-pointer"
          >
            <div className="relative h-[40vh] w-full mb-6 overflow-hidden bg-luxury-teal/20">
              <Image 
                src={`/images/${article.image}`} 
                alt={article.title}
                fill
                className="object-cover transition-transform duration-[2s] ease-cinematic group-hover:scale-105 opacity-80"
              />
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="font-sans text-[10px] uppercase tracking-widest text-luxury-sage">
                {article.category}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-widest text-luxury-sage/60">
                {article.date}
              </span>
            </div>

            <h3 className="font-serif text-2xl text-luxury-beige group-hover:text-luxury-sage transition-colors duration-300 mb-4">
              {article.title}
            </h3>

            {/* Action Button: Conditional based on isReserve flag */}
            <button 
              onClick={() => article.isReserve ? setIsModalOpen(true) : null}
              className="text-[10px] uppercase tracking-[0.2em] border-b border-luxury-beige/30 pb-1 text-luxury-beige hover:border-luxury-beige transition-all"
            >
              {article.isReserve ? "Reserve A Table" : "Read More"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <ReserveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}