import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, useScroll, Text } from '@react-three/drei';
import * as THREE from 'three';

/* ── Single image card in the carousel ─────────────────────────────────── */
function CarouselImage({ url, category, position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <Suspense fallback={
        <mesh>
          <planeGeometry args={[3.8, 2.6]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
      }>
        <Image
          url={url}
          scale={[3.8, 2.6]}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </Suspense>
      {category && (
        <Text
          position={[0, -1.6, 0.1]}
          fontSize={0.15}
          color="#D4A853"
          anchorX="center"
          anchorY="top"
        >
          {category.toUpperCase()}
        </Text>
      )}
    </group>
  );
}

/* ── The carousel group — handles infinite auto-rotation & scroll ────── */
function CarouselItems({ images, radius }) {
  const group = useRef();
  const scroll = useScroll();
  const autoRot = useRef(0);
  
  const ANGLE_STEP = (Math.PI * 2) / images.length;

  useFrame((_, delta) => {
    if (!group.current) return;

    // Slow ambient auto-rotation
    autoRot.current += delta * 0.15;

    // scroll.offset goes 0->1 repeatedly because of infinite={true}
    // We want 1 full scroll down to rotate the carousel by e.g. 1 full circle
    const scrollRot = scroll.offset * Math.PI * 2 * 2; // 2 full rotations per 'page' span

    // Smoothly apply rotation
    group.current.rotation.y = -(scrollRot + autoRot.current);
    
    // Slight cinematic tilt
    group.current.rotation.z = 0.05;
    group.current.rotation.x = 0.05;
  });

  return (
    <group ref={group}>
      {images.map((img, i) => {
        const theta = i * ANGLE_STEP;
        // Place on a circle
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        // Add a very slight vertical wave so they aren't completely flat
        const y = Math.sin(theta * 2) * 0.3;
        
        // Orient image to face outwards
        const rotY = theta;

        return (
          <CarouselImage
            key={img.id || i}
            url={img.imageUrl}
            category={img.category}
            position={[x, y, z]}
            rotation={[0, rotY, 0]}
          />
        );
      })}
    </group>
  );
}

/* ── Dynamic Camera Controller ───────────────────────────────────────── */
function CameraRig({ radius }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Position camera just outside the cylinder
    const targetZ = radius + 6;
    camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

/* ── Main exported component ─────────────────────────────────────────── */
export default function SpiralGallery({ images }) {
  // If there are very few images, the radius would be too small.
  // We duplicate images if there are fewer than 8 to make a nice circle.
  const displayImages = useMemo(() => {
    if (images.length === 0) return [];
    let items = [...images];
    while (items.length < 8) {
      items = [...items, ...images].map((item, i) => ({ ...item, id: `${item.id}-${i}` }));
    }
    return items;
  }, [images]);

  const itemWidth = 4.5;
  const RADIUS = Math.max(5, (displayImages.length * itemWidth) / (Math.PI * 2));

  // We don't need manual focusDistance if we use the target prop
  return (
    <div className="w-full h-screen relative bg-brand-darker cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-brand-darker via-transparent to-brand-darker opacity-30" />

      <div className="absolute top-6 left-8 z-20 pointer-events-none flex flex-col gap-2">
        <span className="text-brand-orange font-accent uppercase tracking-widest text-xs opacity-90 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          INFINITE 3D CAROUSEL
        </span>
        <span className="text-white/40 font-body text-xs">
          Scroll continuously to navigate
        </span>
      </div>

      <Canvas camera={{ position: [0, 0, RADIUS + 10], fov: 45, far: 1000 }}>
        <color attach="background" args={['#050505']} />
        
        {/* Lighter fog so we can see the back of the carousel */}
        <fog attach="fog" args={['#050505', RADIUS + 2, RADIUS * 2 + 15]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        <CameraRig radius={RADIUS} />

        <ScrollControls pages={3} infinite damping={0.2} distance={1.2}>
          <CarouselItems images={displayImages} radius={RADIUS} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
