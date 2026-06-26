import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, ScrollControls, useScroll, Text } from '@react-three/drei';
import * as THREE from 'three';

/* ── Single image card in the spiral ─────────────────────────────────── */
function SpiralImage({ url, category, position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <Suspense fallback={
        <mesh>
          <planeGeometry args={[3.2, 2.2]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      }>
        <Image
          url={url}
          scale={[3.2, 2.2]}
          transparent
          toneMapped={false}
        />
      </Suspense>
      {category && (
        <Text
          position={[0, -1.3, 0.1]}
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

/* ── The spiral group — handles auto-rotation & scroll ───────────────── */
const RADIUS = 4.5;
const ANGLE_STEP = Math.PI / 3.5;
const HEIGHT_STEP = 1.8;

function SpiralItems({ images }) {
  const group = useRef();
  const scroll = useScroll();
  const autoRot = useRef(0);
  const totalHeight = images.length * HEIGHT_STEP;

  useFrame((_, delta) => {
    if (!group.current) return;

    // Slow ambient auto-rotation so the scene never looks static
    autoRot.current += delta * 0.15;

    // Scroll drives the camera "down" the spiral and rotates it
    const scrollY = scroll.offset * totalHeight;
    const scrollRot = scroll.offset * (images.length * ANGLE_STEP);

    // Smooth lerp for fluid feel
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      scrollY,
      0.05
    );

    group.current.rotation.y = scrollRot + autoRot.current;

    // Slight cinematic tilt
    group.current.rotation.z = 0.05;
    group.current.rotation.x = 0.05;
  });

  return (
    <group ref={group}>
      {images.map((img, i) => {
        // Offset by Math.PI/2 so the first image (i=0) is at z=RADIUS, right in front of the camera
        const theta = i * ANGLE_STEP + Math.PI / 2;
        const x = Math.cos(theta) * RADIUS;
        const z = Math.sin(theta) * RADIUS;
        const y = -i * HEIGHT_STEP;
        const rotY = -theta + Math.PI / 2;

        return (
          <SpiralImage
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

/* ── Main exported component ─────────────────────────────────────────── */
export default function SpiralGallery({ images }) {
  const pages = Math.max(images.length / 3, 1.5);

  return (
    <div className="w-full h-screen relative bg-brand-darker cursor-grab active:cursor-grabbing">
      {/* Top + bottom gradient overlays for seamless page blending */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-brand-darker via-transparent to-brand-darker opacity-50" />

      <div className="absolute top-6 left-8 z-20 pointer-events-none flex flex-col gap-2">
        <span className="text-brand-orange font-accent uppercase tracking-widest text-xs opacity-90 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          INTERACTIVE 3D SPACE
        </span>
        <span className="text-white/40 font-body text-xs">
          Scroll to navigate the spiral
        </span>
      </div>

      <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 4, 15]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        <ScrollControls pages={pages} damping={0.2} distance={1.2}>
          <SpiralItems images={images} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
