import React, { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/* ── Lightbox (Premium version) ──────────────────────────────────────────── */
function Lightbox({ images, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const img = images[index];

  const onPrev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const onNext = () => setIndex(i => (i + 1) % images.length);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-black transition-all border border-white/20"
      >
        <FiX size={18} />
      </button>

      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] text-white/60 text-sm font-body tracking-widest">
        {index + 1} / {images.length}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="fixed left-4 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-black transition-all border border-white/20"
      >
        <FiChevronLeft size={22} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="fixed right-4 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-black transition-all border border-white/20"
      >
        <FiChevronRight size={22} />
      </button>

      <motion.div
        key={index}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center gap-4 px-16 w-full max-w-6xl h-full justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.imageUrl}
          alt={img.title || 'Gallery photo'}
          className="max-h-[85vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
          draggable={false}
        />
        {img.title && (
          <p className="text-white/80 text-base font-body tracking-wide">{img.title}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Single 3D image card ────────────────────────────────────────────────── */
function CarouselImage({ url, position, rotation, onTap }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Organized, uniform grid card size
  const w = 10;
  const h = 6.5;

  useFrame(() => {
    if (!ref.current) return;
    const targetScale = hovered ? 1.08 : 1;
    ref.current.scale.lerp(new THREE.Vector3(w * targetScale, h * targetScale, 1), 0.1);
  });

  return (
    <group position={position} rotation={rotation}>
      <Suspense fallback={
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#111" side={THREE.DoubleSide} />
        </mesh>
      }>
        <Image
          ref={ref}
          url={url}
          scale={[w, h]}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
          onClick={(e) => { e.stopPropagation(); onTap(); }}
        />
      </Suspense>
    </group>
  );
}

/* ── Organized Cylinder Carousel ─────────────────────────────────────────── */
function CarouselItems({ images, radius, rows, cols, onTap }) {
  const group = useRef();
  const scroll = useScroll();
  const autoRot = useRef(0);
  const ANGLE_STEP = (Math.PI * 2) / cols;

  useFrame((_, delta) => {
    if (!group.current) return;
    autoRot.current += delta * 0.1; // slow ambient rotation
    const scrollRot = scroll.offset * Math.PI * 2; // scroll rotation
    group.current.rotation.y = -(scrollRot + autoRot.current);
    
    // Slight cinematic tilt
    group.current.rotation.z = 0.05;
    group.current.rotation.x = 0.05;
  });

  return (
    <group ref={group}>
      {images.map((img, i) => {
        // Arrange images cleanly in a rows x cols cylindrical grid
        const col = i % cols;
        const row = Math.floor(i / cols);
        const theta = col * ANGLE_STEP;
        
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        
        // Vertical spacing (row height)
        const ROW_HEIGHT = 7.5; 
        const y = (row - (rows - 1) / 2) * -ROW_HEIGHT; 

        return (
          <CarouselImage
            key={`img-${i}-${img.id}`}
            url={img.imageUrl}
            position={[x, y, z]}
            rotation={[0, theta, 0]}
            onTap={() => onTap(img, i)}
          />
        );
      })}
    </group>
  );
}

/* ── Main Exported Component ─────────────────────────────────────────────── */
export default function SpiralGallery({ images }) {
  const [lightboxData, setLightboxData] = useState(null);

  // Pad the images so they fill out a perfect grid cylinder
  const ROWS = 3;
  const MIN_COLS = 7;
  
  const { displayImages, cols } = useMemo(() => {
    if (images.length === 0) return { displayImages: [], cols: 0 };
    
    let items = [...images];
    // Duplicate images until we have enough to make a good looking cylinder
    while (items.length < ROWS * MIN_COLS) {
      items = [...items, ...images];
    }
    
    const calculatedCols = Math.ceil(items.length / ROWS);
    const targetLength = calculatedCols * ROWS;
    
    // Fill any remainder to keep the grid perfect
    while (items.length < targetLength) {
      items.push(images[items.length % images.length]);
    }
    
    // Trim exactly to the target grid size
    const finalItems = items.slice(0, targetLength);
    
    return { 
      displayImages: finalItems,
      cols: calculatedCols
    };
  }, [images]);

  // Adjust radius so images don't overlap horizontally
  // Each card is width 10, plus some padding = ~11 units per column circumference
  const RADIUS = Math.max(12, (cols * 11.5) / (Math.PI * 2));

  return (
    <>
      <AnimatePresence>
        {lightboxData && (
          <Lightbox 
            images={displayImages} 
            initialIndex={lightboxData.index} 
            onClose={() => setLightboxData(null)} 
          />
        )}
      </AnimatePresence>

      <div className="w-full h-screen relative bg-brand-darker cursor-grab active:cursor-grabbing">
        {/* Gradients to fade out the top/bottom edges */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-brand-darker via-transparent to-brand-darker opacity-60" />

        {/* UI Overlay */}
        <div className="absolute top-24 left-8 z-20 pointer-events-none flex flex-col gap-1">
          <span className="text-brand-gold font-accent uppercase tracking-[0.2em] text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shadow-glow-gold" />
            3D GALLERY
          </span>
          <span className="text-white/40 font-body text-xs mt-1 tracking-wide">
            Scroll to rotate · Drag to explore · Tap to enlarge
          </span>
        </div>

        {/* 3D Canvas */}
        <Canvas camera={{ position: [0, 0, RADIUS + 12], fov: 45, far: 1000 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', RADIUS + 2, RADIUS * 2 + 15]} />
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />

          <ScrollControls pages={4} infinite damping={0.15}>
            <CarouselItems 
              images={displayImages} 
              radius={RADIUS} 
              rows={ROWS} 
              cols={cols}
              onTap={(img, index) => setLightboxData({ img, index })} 
            />
          </ScrollControls>
        </Canvas>
      </div>
    </>
  );
}
