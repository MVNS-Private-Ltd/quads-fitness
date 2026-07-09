import React, { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';

/* ── Lightbox ────────────────────────────────────────────────────────────── */
function Lightbox({ image, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md" onClick={onClose}>
      <button onClick={onClose} className="fixed top-6 right-6 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-brand-gold text-white hover:text-black rounded-full border border-white/20 transition-colors z-[60] text-xl font-bold shadow-xl">
        ✕
      </button>
      <div className="relative flex flex-col items-center gap-4 px-6 w-[70vw]" onClick={e => e.stopPropagation()}>
        <img
          src={image.imageUrl}
          alt="Gallery photo"
          className="w-full h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
          draggable={false}
        />
      </div>
    </div>
  );
}

/* ── Single image card ───────────────────────────────────────────────────── */
function CarouselImage({ url, position, rotation, onTap }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    const t = hovered ? 1.05 : 1;
    ref.current.scale.lerp(new THREE.Vector3(12 * t, 8 * t, 1), 0.1);
  });

  return (
    <group position={position} rotation={rotation}>
      <Suspense fallback={
        <mesh>
          <planeGeometry args={[12, 8]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
      }>
        <Image
          ref={ref}
          url={url}
          scale={[12, 8]}
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

/* ── Carousel ring ───────────────────────────────────────────────────────── */
function CarouselItems({ images, radius, onTap }) {
  const group = useRef();
  const scroll = useScroll();
  const autoRot = useRef(0);
  const ANGLE_STEP = (Math.PI * 2) / images.length;

  useFrame((_, delta) => {
    if (!group.current) return;
    autoRot.current += delta * 0.15; // slow ambient auto-rotation
    const scrollRot = scroll.offset * Math.PI * 4; // scroll drives rotation
    group.current.rotation.y = -(scrollRot + autoRot.current);
    group.current.rotation.z = 0.04;
    group.current.rotation.x = 0.03;
  });

  return (
    <group ref={group}>
      {images.map((img, i) => {
        const theta = i * ANGLE_STEP + Math.PI / 2;
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        const y = Math.sin(theta * 2) * 0.3;
        return (
          <CarouselImage
            key={img._key || i}
            url={img.imageUrl}
            position={[x, y, z]}
            rotation={[0, theta, 0]}
            onTap={() => onTap(img)}
          />
        );
      })}
    </group>
  );
}

/* ── Main exported component ─────────────────────────────────────────────── */
export default function SpiralGallery({ images }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  // Pad ring to minimum 8 slots so it always looks full
  const displayImages = useMemo(() => {
    if (images.length === 0) return [];
    let items = [...images];
    let c = 0;
    while (items.length < 8) {
      items = [...items, ...images.map(im => ({ ...im, id: `${im.id}-${++c}` }))];
    }
    return items.map((img, i) => ({ ...img, _key: `slot-${i}-${img.id}` }));
  }, [images]);

  const RADIUS = Math.max(12, (displayImages.length * 13) / (Math.PI * 2));

  const handleTap = (img) => {
    const originalId = String(img.id).split('-')[0];
    const original = images.find(im => String(im.id) === originalId) || img;
    setLightboxImage(original);
  };

  return (
    <>
      {lightboxImage && <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />}

      <div className="w-full h-screen relative bg-brand-darker cursor-grab active:cursor-grabbing">
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-brand-darker via-transparent to-brand-darker opacity-30" />

        <div className="absolute top-24 left-8 z-20 pointer-events-none flex flex-col gap-1">
          <span className="text-brand-orange font-accent uppercase tracking-widest text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            GALLERY
          </span>
          <span className="text-white/35 font-body text-xs">Scroll to rotate · Tap to enlarge</span>
        </div>

        <Canvas camera={{ position: [0, 0, RADIUS + 10], fov: 45, far: 1000 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', RADIUS + 2, RADIUS * 2 + 15]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />

          <ScrollControls pages={3} infinite damping={0.2}>
            <CarouselItems images={displayImages} radius={RADIUS} onTap={handleTap} />
          </ScrollControls>
        </Canvas>
      </div>
    </>
  );
}
