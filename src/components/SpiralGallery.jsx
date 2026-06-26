import React, { useRef, Suspense, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

/* ── Lightbox overlay ────────────────────────────────────────────────────── */
function Lightbox({ image, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-6 px-6 w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-14 right-4 text-white/60 hover:text-white font-accent text-sm uppercase tracking-widest transition-colors"
        >
          ✕ Close
        </button>
        <img
          src={image.imageUrl}
          alt={image.title || image.category || 'Gallery photo'}
          className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
          draggable={false}
        />
        {(image.title || image.category) && (
          <div className="text-center">
            {image.category && (
              <span className="text-brand-gold text-xs font-accent tracking-widest uppercase">{image.category}</span>
            )}
            {image.title && (
              <p className="text-white font-display text-2xl mt-1">{image.title}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Single image card ───────────────────────────────────────────────────── */
function CarouselImage({ url, position, rotation, onTap }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const t = hovered ? 1.05 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(t, t, 1), 0.1);
  });

  return (
    <group position={position} rotation={rotation}>
      <Suspense fallback={
        <mesh>
          <planeGeometry args={[6, 4]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
      }>
        <Image
          ref={meshRef}
          url={url}
          scale={[6, 4]}
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
function CarouselItems({ images, radius, scrollRotRef }) {
  const groupRef = useRef();
  const autoRot = useRef(0);
  const ANGLE_STEP = (Math.PI * 2) / images.length;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    autoRot.current += delta * 0.08; // slow ambient spin
    groupRef.current.rotation.y = -(scrollRotRef.current + autoRot.current);
  });

  return (
    <group ref={groupRef}>
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
            onTap={img.onTap}
          />
        );
      })}
    </group>
  );
}

/* ── Camera controlled by drag (orbit) ──────────────────────────────────── */
function OrbitCamera({ radius, orbitRef }) {
  const { camera } = useThree();
  
  useFrame(() => {
    const phi   = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, orbitRef.phi));   // vertical clamp
    const theta = orbitRef.theta;
    const dist  = radius + 7;

    const x = dist * Math.sin(phi) * Math.sin(theta);
    const y = dist * Math.cos(phi);
    const z = dist * Math.sin(phi) * Math.cos(theta);

    camera.position.lerp(new THREE.Vector3(x, y, z), 0.06);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── Main exported component ─────────────────────────────────────────────── */
export default function SpiralGallery({ images }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  // Scroll → carousel rotation
  const scrollRotRef = useRef(0);

  // Drag → camera orbit
  const orbitRef = useRef({ theta: Math.PI / 2, phi: Math.PI / 2 }); // PI/2 = straight front view
  const isDragging = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const orbitStart = useRef({ theta: 0, phi: 0 });
  const moved = useRef(false);

  // Pad ring to at least 8 images
  const displayImages = useMemo(() => {
    if (images.length === 0) return [];
    let items = [...images];
    let c = 0;
    while (items.length < 8) {
      items = [...items, ...images.map(im => ({ ...im, id: `${im.id}-${++c}` }))];
    }
    return items.map((img, i) => ({
      ...img,
      _key: `slot-${i}-${img.id}`,
      onTap: () => {
        if (moved.current) return;
        const originalId = String(img.id).split('-')[0];
        const original = images.find(im => String(im.id) === originalId) || img;
        setLightboxImage(original);
      },
    }));
  }, [images]);

  const CARD_WIDTH = 7;
  const RADIUS = Math.max(6, (displayImages.length * CARD_WIDTH) / (Math.PI * 2));

  /* ── Scroll → rotate ring ─────────────────────────────────────────── */
  const handleWheel = useCallback((e) => {
    scrollRotRef.current += e.deltaY * 0.003;
  }, []);

  /* ── Pointer down ─────────────────────────────────────────────────── */
  const handlePointerDown = useCallback((e) => {
    isDragging.current = true;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    orbitStart.current = { theta: orbitRef.current.theta, phi: orbitRef.current.phi };
    moved.current = false;
  }, []);

  /* ── Pointer move → orbit camera ──────────────────────────────────── */
  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
    orbitRef.current.theta = orbitStart.current.theta - dx * 0.005;
    // drag UP (negative dy) = camera goes higher = phi decreases toward 0
    orbitRef.current.phi = Math.max(0.3, Math.min(Math.PI * 0.85, orbitStart.current.phi - dy * 0.005));
  }, []);

  const handlePointerUp = useCallback(() => { isDragging.current = false; }, []);

  /* ── Touch events ─────────────────────────────────────────────────── */
  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0];
    isDragging.current = true;
    pointerStart.current = { x: t.clientX, y: t.clientY };
    orbitStart.current = { theta: orbitRef.current.theta, phi: orbitRef.current.phi };
    moved.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    const t = e.touches[0];
    const dx = t.clientX - pointerStart.current.x;
    const dy = t.clientY - pointerStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
    orbitRef.current.theta = orbitStart.current.theta - dx * 0.005;
    // drag UP = phi decreases = camera goes higher
    orbitRef.current.phi = Math.max(0.3, Math.min(Math.PI * 0.85, orbitStart.current.phi - dy * 0.005));
  }, []);

  const handleTouchEnd = useCallback(() => { isDragging.current = false; }, []);

  return (
    <>
      {lightboxImage && <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />}

      <div
        className="w-full h-screen relative bg-brand-darker select-none"
        style={{ touchAction: 'none' }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-brand-darker via-transparent to-brand-darker opacity-20" />

        {/* HUD */}
        <div className="absolute top-24 left-8 z-20 pointer-events-none flex flex-col gap-1">
          <span className="text-brand-orange font-accent uppercase tracking-widest text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            GALLERY
          </span>
          <span className="text-white/35 font-body text-xs">
            Scroll to rotate · Drag to look around · Tap to enlarge
          </span>
        </div>

        <Canvas camera={{ position: [0, 0, RADIUS + 7], fov: 50, far: 1000 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', RADIUS + 4, RADIUS * 2 + 18]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 10]} intensity={1.2} />
          <OrbitCamera radius={RADIUS} orbitRef={orbitRef.current} />
          <CarouselItems images={displayImages} radius={RADIUS} scrollRotRef={scrollRotRef} />
        </Canvas>
      </div>
    </>
  );
}
