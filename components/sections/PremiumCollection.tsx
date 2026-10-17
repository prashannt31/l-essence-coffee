'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const COLLECTION = [
  { id: 1, name: "The Radiant — Luminous Profile", origin: "Ethiopia", note: "Light Profile", accent: "#AAB79A", href: "/shop?collection=origin" },
  { id: 2, name: "The Serene — Velveteen Profile", origin: "Colombia", note: "Balanced Profile", accent: "#CACBA7", href: "/shop?collection=canopy" },
  { id: 3, name: "The Nocturnal — Velvet Profile", origin: "Sumatra", note: "Dark Profile", accent: "#6D8575", href: "/shop?collection=depth" },
  { id: 4, name: "The Reserve", origin: "Panama", note: "Table Booking", accent: "#AAB79A", href: "/reserve" },
];

export default function PremiumCollection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll-linked progress — no spring here, raw scrub
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Single spring on the translate — ultra low mass = instant response
  // High stiffness + moderate damping = snappy but smooth, zero jitter
  const springX = useSpring(scrollYProgress, {
    mass: 0.05,
    stiffness: 400,
    damping: 40,
    restDelta: 0.0001,
  });

  // Map 0→1 scroll to a pixel offset
  // -75vw covers 4 cards. Tweak if card widths change.
  const x = useTransform(springX, [0, 1], ["0vw", "-85vw"]);

  return (
    // Pin height = scroll distance. 250vh gives a long, unhurried horizontal scroll.
    <section
      ref={sectionRef}
      id="collection"
      className="relative h-[120vh]"
      style={{ background: "#000000" }}
    >
      {/* Sticky viewport — pure black, no tint */}
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center"
        style={{ background: "#000000" }}
      >
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 w-full h-48 z-30 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 0%, #000000 100%)" }}
        />

        {/* Header */}
        <div className="absolute top-16 left-12 md:left-20 z-20 pointer-events-none">
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-4"
            style={{ color: "#6D8575", fontFamily: "'Jost', sans-serif", fontWeight: 200 }}
          >
            Curated Expressions
          </p>
          <h2
            className="text-4xl md:text-6xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              color: "#CACBA7",
              lineHeight: 0.95,
            }}
          >
            The<br />Collection
          </h2>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-12 md:left-20 z-20 flex items-center gap-3 pointer-events-none"
          style={{ color: "#6D8575", fontSize: "10px", letterSpacing: "0.25em" }}
        >
          <span
            style={{
              display: "block",
              width: "40px",
              height: "1px",
              background: "#6D8575",
            }}
          />
          SCROLL TO EXPLORE
        </div>

        {/* THE TRACK — GPU composited, no layout thrash */}
        <motion.div
          ref={trackRef}
          style={{
            x,
            // Force GPU layer — prevents ANY layout recalc during animation
            willChange: "transform",
            transform: "translateZ(0)",
          }}
          className="flex items-center gap-6 md:gap-12 pl-12 md:pl-20 pt-16"
        >
          {COLLECTION.map((item, index) => (
            <Card key={item.id} item={item} index={index} />
          ))}

          {/* End spacer so last card doesn't snap to edge */}
          <div className="shrink-0 w-[20vw] md:w-[10vw]" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Card ────────────────────────────────────────────────────────
function Card({ item, index }: { item: typeof COLLECTION[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative shrink-0 overflow-hidden cursor-pointer"
      style={{
        width: "clamp(280px, 32vw, 480px)",
        height: "clamp(380px, 65vh, 600px)",
        // Stagger card entry scale for visual depth
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 1.2,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Absolute Interactive Anchor Overlay Layer */}
      <Link href={item.href} className="absolute inset-0 z-40" />

      {/* Card background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, rgba(61,87,87,0.6), rgba(6,13,13,0.95))`,
          border: "1px solid rgba(109,133,117,0.12)",
        }}
      />

      {/* Image layer — separate GPU layer via will-change */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ willChange: "transform" }}
      >
        <Image
          src={`/images/collection-${item.id}.jpg`}
          alt={item.name}
          fill
          priority={index < 2}
          className="object-cover"
          style={{
            opacity: 0.55,
            mixBlendMode: "luminosity",
            willChange: "transform",
          }}
          sizes="(max-width: 768px) 85vw, 32vw"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
        }}
      />

      {/* Accent top border — animates in on hover */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] z-10"
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ background: item.accent }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 z-10 pointer-events-none">
        {/* Top: index */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(4rem, 8vw, 7rem)",
            fontWeight: 300,
            color: "rgba(202,203,167,0.06)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          0{item.id}
        </div>

        {/* Bottom: info */}
        <div>
          {/* Tags — slide up on hover */}
          <motion.div
            className="flex items-center gap-3 mb-4"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: item.accent,
                border: `1px solid ${item.accent}40`,
                padding: "4px 10px",
                fontWeight: 200,
              }}
            >
              {item.origin}
            </span>
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(202,203,167,0.5)",
                fontWeight: 200,
              }}
            >
              {item.note}
            </span>
          </motion.div>

          {/* Name */}
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 300,
              color: "#CACBA7",
              lineHeight: 1.1,
              marginBottom: "1.2rem",
            }}
          >
            {item.name}
          </h3>

          {/* CTA line */}
          <motion.div
            className="flex items-center gap-3"
            animate={{ opacity: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              animate={{ width: hovered ? "32px" : "16px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ height: "1px", background: item.accent }}
            />
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                color: item.accent,
                fontWeight: 200,
                textTransform: "uppercase",
              }}
            >
              Discover
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}