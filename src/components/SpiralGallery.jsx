import React, { useRef, Suspense, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';

/* ── Lightbox overlay ────────────────────────────────────────────────────── */
function Lightbox({ image, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Prevent click-through on inner container */}
      <div
        className="relative flex flex-col items-center gap-4 px-4 max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-4 text-white/60 hover:text-white font-accent text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          ✕ Close
        </button>

        {/* Image */}
        <img
          src={image.imageUrl}
          alt={image.title || image.category || 'Gallery photo'}
          className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/5"
          draggable={false}
        />

        {/* Caption */}
        {(image.title || image.category) && (
          <div className="text-center">
            {image.category && (
              <span className="text-brand-gold text-xs font-accent tracking-widest uppercase block">
                {image.category}
              </span>
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

/* ── Single image in the carousel ────────────────────────────────────────── */
function CarouselImage({ url, position, rotation, onTap }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = hovered ? 1.06 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target, target, 1),
      0.12
    );
  });

  return (
    <group position={position} rotation={rotation}>
      <Suspense fallback={
        <mesh>
          <planeGeometry args={[3.8, 2.6]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
      }>
        <Image
          ref={meshRef}
          url={url}
          scale={[3.8, 2.6]}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = 'grab';
          }}
          onClick={(e) => {
            e.stopPropagation();
            onTap();
          }}
        />
      </Suspense>
    </group>
  );
}

/* ── Carousel ring ───────────────────────────────────────────────────────── */
function CarouselItems({ images, radius, rotRef }) {
  const groupRef = useRef();
  const autoRot = useRef(0);
  const ANGLE_STEP = (Math.PI * 2) / images.length;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    autoRot.current += delta * 0.10; // slow ambient spin
    groupRef.current.rotation.y = -(rotRef.current + autoRot.current);
    groupRef.current.rotation.z = 0.04;
    groupRef.current.rotation.x = 0.03;
  });

  return (
    <group ref={groupRef}>
      {images.map((img, i) => {
        const theta = i * ANGLE_STEP + Math.PI / 2;
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        const y = Math.sin(theta * 2) * 0.3;
        const rotY = theta;
        return (
          <CarouselImage
            key={img._key || i}
            url={img.imageUrl}
            position={[x, y, z]}
            rotation={[0, rotY, 0]}
            onTap={img.onTap}
          />
        );
      })}
    </group>
  );
}

/* ── Camera ──────────────────────────────────────────────────────────────── */
function CameraRig({ radius }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 0, radius + 6), 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Main exported component ─────────────────────────────────────────────── */
export default function SpiralGallery({ images }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  // Rotation controlled by scroll + drag
  const rotRef = useRef(0);
  const isDragging = useRef(false);
  const pointerStart = useRef({ x: 0 });
  const rotStart = useRef(0);
  const moved = useRef(false); // distinguish click vs drag

  // Pad the ring so it always looks full (min 8 images)
  const displayImages = useMemo(() => {
    if (images.length === 0) return [];
    let items = [...images];
    let counter = 0;
    while (items.length < 8) {
      items = [...items, ...images.map(im => ({ ...im, id: `${im.id}-${++counter}` }))];
    }
    // Attach a handler for each slot; map back to the original image for the lightbox
    return items.map((img, i) => ({
      ...img,
      _key: `${img.id}-slot-${i}`,
      onTap: () => {
        if (moved.current) return; // was a drag, not a tap
        const original = images.find(im => String(im.id) === String(img.id).split('-')[0]) || img;
        setLightboxImage(original);
      },
    }));
  }, [images]);

  const itemWidth = 4.5;
  const RADIUS = Math.max(5, (displayImages.length * itemWidth) / (Math.PI * 2));

  /* ── Scroll → rotate ────────────────────────────────────────────────── */
  const handleWheel = useCallback((e) => {
    rotRef.current += e.deltaY * 0.003;
  }, []);

  /* ── Pointer drag → rotate ──────────────────────────────────────────── */
  const handlePointerDown = useCallback((e) => {
    isDragging.current = true;
    pointerStart.current = { x: e.clientX };
    rotStart.current = rotRef.current;
    moved.current = false;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - pointerStart.current.x;
    if (Math.abs(dx) > 4) moved.current = true;
    rotRef.current = rotStart.current - dx * 0.006;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  /* ── Touch drag → rotate ────────────────────────────────────────────── */
  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0];
    isDragging.current = true;
    pointerStart.current = { x: t.clientX };
    rotStart.current = rotRef.current;
    moved.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    const t = e.touches[0];
    const dx = t.clientX - pointerStart.current.x;
    if (Math.abs(dx) > 4) moved.current = true;
    rotRef.current = rotStart.current - dx * 0.006;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <>
      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}

      {/* Canvas container */}
      <div
        className="w-full h-screen relative bg-brand-darker select-none"
        style={{ cursor: isDragging.current ? 'grabbing' : 'grab', touchAction: 'none' }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle top/bottom vignette */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-brand-darker via-transparent to-brand-darker opacity-30" />

        {/* HUD */}
        <div className="absolute top-24 left-8 z-20 pointer-events-none flex flex-col gap-1">
          <span className="text-brand-orange font-accent uppercase tracking-widest text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            GALLERY
          </span>
          <span className="text-white/35 font-body text-xs">
            Drag to rotate · Tap photo to enlarge
          </span>
        </div>

        <Canvas
          camera={{ position: [0, 0, RADIUS + 10], fov: 45, far: 1000 }}
          style={{ pointerEvents: 'none' }} // outer div handles pointer events for drag
        >
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', RADIUS + 2, RADIUS * 2 + 15]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <CameraRig radius={RADIUS} />
          <CarouselItems images={displayImages} radius={RADIUS} rotRef={rotRef} />
        </Canvas>
      </div>
    </>
  );
}
