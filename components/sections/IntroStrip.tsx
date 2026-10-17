'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Float, Sparkles, PerspectiveCamera, MeshTransmissionMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

export default function IntroStrip() {
  return (
    <section className="relative h-[120vh] w-full overflow-hidden bg-luxury-black">
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]} performance={{ min: 0.5 }}>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={40} />
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#CACBA7" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3D5757" />
          
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <Sparkles count={120} scale={12} size={1.5} speed={0.3} opacity={0.15} color="#AAB79A" />
            
            <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
              <mesh position={[0, -0.5, 0]}>
                <torusKnotGeometry args={[1.5, 0.4, 256, 64]} />
             <MeshTransmissionMaterial 
                  backside
                  samples={3}
                  resolution={256}
                  thickness={0.5}
                  roughness={0.2}
                  transmission={0.9}
                  ior={1.5}
                  chromaticAberration={0.05}
                  anisotropy={0.3}
                  color="#6D8575"
                />
              </mesh>
            </Float>
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-luxury-black via-luxury-black/80 to-transparent z-10 pointer-events-none" />

      <div className="relative z-10 flex h-screen flex-col items-center justify-center pointer-events-none px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-center flex flex-col items-center"
        >
          <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-luxury-sage mb-8 block">
            The Pursuit of Perfection
          </span>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tight text-luxury-beige drop-shadow-2xl">
            L'Essence
          </h1>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-luxury-beige/50">Begin</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-luxury-beige/50 to-transparent" />
      </motion.div>
    </section>
  );
}