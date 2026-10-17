'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

function Model() {
  const { scene } = useGLTF('/models/coffee-pack.glb'); 
  
  return (
    <primitive 
      object={scene} 
      scale={9.5}             
      position={[0, -1.2, 0]} 
      rotation={[0, Math.PI / 6, 0]} 
    />
  );
}

export default function Feature3D() {
  return (
    <section className="relative w-full h-screen bg-luxury-black flex flex-col items-center justify-center overflow-hidden py-24">
      
      {/* Typography Layout Group at the Top */}
      <div className="absolute top-12 text-center z-10 space-y-3 px-6 max-w-2xl">
        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-luxury-sage block">
          The Craft
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-luxury-beige leading-tight">
          Sculpted by Nature. Refined by Us.
        </h2>
        <p className="font-sans text-xs md:text-sm font-light text-luxury-sage/80 max-w-md mx-auto leading-relaxed pt-1">
          Interact with the architectural geometry of our roasting process. Click and drag to inspect the absolute perfection of every curve.
        </p>
      </div>

      {/* Main Viewport for the 3D Cup */}
      <div className="w-full h-[55vh] mt-40 cursor-grab active:cursor-grabbing flex items-center justify-center">
        <Canvas 
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.6} />
          <Environment preset="studio" />

          {/* ADDED THIS LINE: Enables clicking and dragging to rotate the model */}
          {/* enableZoom={false} stops the user from accidentally scrolling inside the canvas */}
          <OrbitControls enableZoom={false} makeDefault />

          <Suspense fallback={null}>
            <Float 
              speed={1.5} 
              rotationIntensity={0.4} 
              floatIntensity={0.8}
            >
              <Model />
            </Float>

            <ContactShadows 
              position={[0, -1.3, 0]} 
              opacity={0.5} 
              scale={8} 
              blur={2} 
              far={3} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Premium Scroll Indicator Underneath the 3D Canvas */}
      <motion.div 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: [0.3, 1, 0.3], y: [0, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 text-center z-10 pointer-events-none flex flex-col items-center"
      >
        <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-luxury-sage block mb-3">
          Scroll to Explore
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-luxury-sage/60 via-luxury-sage/20 to-transparent" />
      </motion.div>

    </section>
  );
}

useGLTF.preload('/models/coffee-pack.glb');