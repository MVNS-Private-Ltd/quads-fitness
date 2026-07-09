import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Sparkles, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

// --- CACHED GEOMETRIES & MATERIALS FOR PERFORMANCE ---
const plateGeo1 = new THREE.CylinderGeometry(1, 1, 1, 24, 1, false)
const plateGeo2 = new THREE.CylinderGeometry(0.78, 0.78, 1.05, 24)
const plateGeo3 = new THREE.CylinderGeometry(0.2, 0.2, 1.1, 24)

const plateMat1a = new THREE.MeshStandardMaterial({ color: '#101010', metalness: 0.35, roughness: 0.55 })
const plateMat1b = new THREE.MeshStandardMaterial({ color: '#151515', metalness: 0.35, roughness: 0.55 })
const plateMat1c = new THREE.MeshStandardMaterial({ color: '#121212', metalness: 0.35, roughness: 0.55 })
const plateMat1d = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.35, roughness: 0.55 })

const plateMat2 = new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.4, roughness: 0.45 })
const plateMat3 = new THREE.MeshStandardMaterial({ color: '#bfc3c7', metalness: 0.95, roughness: 0.15 })

function getPlateMat(color) {
  if (color === '#101010') return plateMat1a;
  if (color === '#151515') return plateMat1b;
  if (color === '#121212') return plateMat1c;
  return plateMat1d;
}

function useScrollProgress() {
  const progress = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

function WeightPlate({ position, radius = 0.7, thickness = 0.18, color = '#111111' }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh geometry={plateGeo1} material={getPlateMat(color)} scale={[radius, thickness, radius]} receiveShadow />
      <mesh geometry={plateGeo2} material={plateMat2} scale={[radius, thickness, radius]} receiveShadow />
      <mesh geometry={plateGeo3} material={plateMat3} scale={[radius, thickness, radius]} castShadow receiveShadow />
    </group>
  )
}

const barGeo = new THREE.CylinderGeometry(0.045, 0.045, 4.8, 16)
const barMat = new THREE.MeshStandardMaterial({ color: '#cfd3d6', metalness: 1, roughness: 0.16 })
const gripGeo = new THREE.TorusGeometry(0.053, 0.004, 8, 16)
const gripMat = new THREE.MeshStandardMaterial({ color: '#9ea4aa', metalness: 0.95, roughness: 0.25 })
const collarGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12)
const collarMat = new THREE.MeshStandardMaterial({ color: '#9da3a8', metalness: 0.95, roughness: 0.2 })

function Barbell() {
  const groupRef = useRef()
  const leftSpin = useRef()
  const rightSpin = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    groupRef.current.rotation.y = t * 0.22
    groupRef.current.rotation.x = -0.18 + Math.sin(t * 0.45) * 0.04
    groupRef.current.rotation.z = Math.sin(t * 0.22) * 0.03
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.08
    groupRef.current.position.x = 6.5 + Math.sin(t * 0.3) * 0.04
    groupRef.current.scale.setScalar(1.12)

    if (leftSpin.current) leftSpin.current.rotation.x = t * 0.35
    if (rightSpin.current) rightSpin.current.rotation.x = t * 0.35
  })

  return (
    <group ref={groupRef}>
      {/* bar */}
      <mesh geometry={barGeo} material={barMat} receiveShadow rotation={[0, 0, Math.PI / 2]} />

      {/* grip rings */}
      {[-0.45, -0.22, 0, 0.22, 0.45].map((x, i) => (
        <mesh key={i} geometry={gripGeo} material={gripMat} position={[x, 0, 0]} receiveShadow rotation={[0, 0, Math.PI / 2]} />
      ))}

      {/* collars */}
      <mesh geometry={collarGeo} material={collarMat} position={[-1.25, 0, 0]} receiveShadow rotation={[0, 0, Math.PI / 2]} />
      <mesh geometry={collarGeo} material={collarMat} position={[1.25, 0, 0]} receiveShadow rotation={[0, 0, Math.PI / 2]} />

      {/* left plates */}
      <group ref={leftSpin} position={[-1.55, 0, 0]}>
        <WeightPlate position={[-0.22, 0, 0]} radius={0.72} thickness={0.14} color="#101010" />
        <WeightPlate position={[0.0, 0, 0]} radius={0.58} thickness={0.16} color="#151515" />
        <WeightPlate position={[0.22, 0, 0]} radius={0.46} thickness={0.14} color="#121212" />
      </group>

      {/* right plates */}
      <group ref={rightSpin} position={[1.55, 0, 0]}>
        <WeightPlate position={[-0.22, 0, 0]} radius={0.46} thickness={0.14} color="#121212" />
        <WeightPlate position={[0.0, 0, 0]} radius={0.58} thickness={0.16} color="#151515" />
        <WeightPlate position={[0.22, 0, 0]} radius={0.72} thickness={0.14} color="#101010" />
      </group>
    </group>
  )
}

const ringGeo1 = new THREE.TorusGeometry(2.7, 0.015, 12, 48)
const ringMat1 = new THREE.MeshStandardMaterial({
  color: '#ff6b00',
  emissive: '#ff6b00',
  emissiveIntensity: 0.45,
  transparent: true,
  opacity: 0.65
})

const ringGeo2 = new THREE.TorusGeometry(3.25, 0.01, 12, 48)
const ringMat2 = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.16
})

function EnergyRing({ scrollProgress }) {
  const ring1 = useRef()
  const ring2 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const s = scrollProgress.current
    if (ring1.current) {
      ring1.current.rotation.y = t * 0.25 + s * 0.8
      ring1.current.rotation.x = Math.PI / 2.8
      ring1.current.position.x = 6.45
    }
    if (ring2.current) {
      ring2.current.rotation.y = -t * 0.18 - s * 0.6
      ring2.current.rotation.z = t * 0.08
      ring2.current.position.x = 6.45
    }
  })

  return (
    <>
      <mesh ref={ring1} geometry={ringGeo1} material={ringMat1} position={[6.45, 0, -0.6]} />
      <mesh ref={ring2} geometry={ringGeo2} material={ringMat2} position={[6.45, 0, -1.1]} />
    </>
  )
}

const coreGeo = new THREE.SphereGeometry(1.35, 24, 24)
const coreMat = new THREE.MeshStandardMaterial({
  color: '#ff6b00',
  emissive: '#ff6b00',
  emissiveIntensity: 0.2,
  transparent: true,
  opacity: 0.15
})

function BackgroundCore() {
  return <mesh geometry={coreGeo} material={coreMat} position={[6.55, 0, -2.4]} />
}

function CameraRig({ scrollProgress }) {
  useFrame(({ camera }) => {
    const s = scrollProgress.current
    camera.position.z = 6.4 - s * 0.6
    camera.position.y = 0.25 + s * 0.25
    camera.position.x = 5.0 + Math.sin(s * Math.PI) * 0.06
    camera.lookAt(5.3, 0, 0)
  })
  return null
}

export default function Hero3D() {
  const scrollProgress = useScrollProgress()
  
  // Use localStorage to remember performance settings
  const [dpr, setDpr] = useState(() => {
    try {
      const saved = localStorage.getItem('quads_dpr');
      return saved ? parseFloat(saved) : window.devicePixelRatio || 1;
    } catch {
      return window.devicePixelRatio || 1;
    }
  });

  return (
    <Canvas
      camera={{ position: [5.0, 0.15, 6.2], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={dpr}
      style={{ background: 'transparent' }}
    >
      <PerformanceMonitor 
        onIncline={() => {
          // Cap DPR at 1.2 max for laptops to ensure buttery smoothness
          setDpr(Math.min(1.2, window.devicePixelRatio || 1));
          try { localStorage.setItem('quads_dpr', Math.min(1.2, window.devicePixelRatio || 1).toString()); } catch {}
        }} 
        onDecline={() => {
          setDpr(0.5); // Fallback to even lower resolution when lagging
          try { localStorage.setItem('quads_dpr', '0.5'); } catch {}
        }} 
      />
      {/* Removed solid background color so the image behind is visible */}
      <fog attach="fog" args={['#000000', 7, 12]} />

      {/* lighting */}
      <ambientLight intensity={2.5} />
      <directionalLight position={[8, 5, 8]} intensity={4} color="#ffffff" />
      <pointLight position={[6.5, 2, 5]} intensity={40} distance={20} color="#ffffff" />
      <pointLight position={[4.0, -1, 4]} intensity={20} distance={15} color="#ff6b00" />

      <CameraRig scrollProgress={scrollProgress} />
      <BackgroundCore />
      <EnergyRing scrollProgress={scrollProgress} />

      <Sparkles count={6} scale={3.5} size={1.2} speed={0.35} color="#ff8a2a" opacity={0.4} />

      <Float speed={1.0} rotationIntensity={0.06} floatIntensity={0.18}>
        <Barbell />
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.35}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  )
}