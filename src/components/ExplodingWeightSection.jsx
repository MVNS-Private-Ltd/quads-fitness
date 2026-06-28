import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { FaBolt, FaCrosshairs, FaShieldAlt, FaDumbbell, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

// --- CACHED GEOMETRIES & MATERIALS ---
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

const barGeo = new THREE.CylinderGeometry(0.045, 0.045, 4.8, 16)
const barMat = new THREE.MeshStandardMaterial({ color: '#cfd3d6', metalness: 1, roughness: 0.16 })
const gripGeo = new THREE.TorusGeometry(0.053, 0.004, 8, 16)
const gripMat = new THREE.MeshStandardMaterial({ color: '#9ea4aa', metalness: 0.95, roughness: 0.25 })
const collarGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12)
const collarMat = new THREE.MeshStandardMaterial({ color: '#9da3a8', metalness: 0.95, roughness: 0.2 })

// WeightPlate component modified to accept an innerRef
function WeightPlate({ innerRef, position, radius = 0.7, thickness = 0.18, color = '#111111' }) {
  return (
    <group ref={innerRef} position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh geometry={plateGeo1} material={getPlateMat(color)} scale={[radius, thickness, radius]} receiveShadow />
      <mesh geometry={plateGeo2} material={plateMat2} scale={[radius, thickness, radius]} receiveShadow />
      <mesh geometry={plateGeo3} material={plateMat3} scale={[radius, thickness, radius]} castShadow receiveShadow />
    </group>
  )
}

function ExplodingBarbell({ progressRef }) {
  const groupRef = useRef()
  const leftSpin = useRef()
  const rightSpin = useRef()
  
  const l1 = useRef(), l2 = useRef(), l3 = useRef()
  const r1 = useRef(), r2 = useRef(), r3 = useRef()
  const lc = useRef(), rc = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const s = progressRef.current // 0 to 1

    // Group movement
    // Starts centered, then moves to the left and gets closer as we scroll down
    groupRef.current.rotation.y = t * 0.2 + s * Math.PI * 1.5
    groupRef.current.rotation.x = -0.18 + Math.sin(t * 0.45) * 0.04 + s * 0.4
    groupRef.current.rotation.z = Math.sin(t * 0.22) * 0.03 + s * 0.2
    
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.08 - (s * 1.5)
    groupRef.current.position.x = -(s * 3.5) // Move left
    groupRef.current.position.z = s * 3.5    // Move closer to camera
    
    groupRef.current.scale.setScalar(1.2 + s * 0.8)

    // Spin speed increases as we scroll
    if (leftSpin.current) leftSpin.current.rotation.x = t * (0.35 + s * 2)
    if (rightSpin.current) rightSpin.current.rotation.x = t * (0.35 + s * 2)

    // Explosion logic: Move plates and collars outward based on scroll offset
    // The deeper we scroll, the further they separate
    const sep = s * 3 // separation multiplier

    // Left collars and plates move in -x direction
    if (lc.current) lc.current.position.x = -1.25 - sep * 0.5
    if (l3.current) l3.current.position.x = 0.22 - sep * 1.0   // inner plate
    if (l2.current) l2.current.position.x = 0.0 - sep * 1.5    // middle plate
    if (l1.current) l1.current.position.x = -0.22 - sep * 2.0  // outer plate

    // Right collars and plates move in +x direction
    if (rc.current) rc.current.position.x = 1.25 + sep * 0.5
    if (r1.current) r1.current.position.x = -0.22 + sep * 1.0  // inner plate
    if (r2.current) r2.current.position.x = 0.0 + sep * 1.5    // middle plate
    if (r3.current) r3.current.position.x = 0.22 + sep * 2.0   // outer plate
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
      <mesh ref={lc} geometry={collarGeo} material={collarMat} position={[-1.25, 0, 0]} receiveShadow rotation={[0, 0, Math.PI / 2]} />
      <mesh ref={rc} geometry={collarGeo} material={collarMat} position={[1.25, 0, 0]} receiveShadow rotation={[0, 0, Math.PI / 2]} />

      {/* left plates */}
      <group ref={leftSpin} position={[-1.55, 0, 0]}>
        <WeightPlate innerRef={l1} position={[-0.22, 0, 0]} radius={0.72} thickness={0.14} color="#101010" />
        <WeightPlate innerRef={l2} position={[0.0, 0, 0]} radius={0.58} thickness={0.16} color="#151515" />
        <WeightPlate innerRef={l3} position={[0.22, 0, 0]} radius={0.46} thickness={0.14} color="#121212" />
      </group>

      {/* right plates */}
      <group ref={rightSpin} position={[1.55, 0, 0]}>
        <WeightPlate innerRef={r1} position={[-0.22, 0, 0]} radius={0.46} thickness={0.14} color="#121212" />
        <WeightPlate innerRef={r2} position={[0.0, 0, 0]} radius={0.58} thickness={0.16} color="#151515" />
        <WeightPlate innerRef={r3} position={[0.22, 0, 0]} radius={0.72} thickness={0.14} color="#101010" />
      </group>
    </group>
  )
}

function HTMLContent({ progressRef }) {
  // We use forceUpdate to re-render HTML based on progress if needed, 
  // but better to just use standard css opacity based on progressRef state if we pass it as a prop.
  // Actually, passing progress as a prop triggers re-renders. Let's make progress a state for the HTML part.
  return null; // We will put HTML directly in the main component
}

export default function ExplodingWeightSection() {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const [htmlProgress, setHtmlProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const end = rect.height - window.innerHeight;
      if (end <= 0) return;
      
      let p = -rect.top / end;
      p = Math.max(0, Math.min(1, p));
      
      progressRef.current = p;
      setHtmlProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [dpr, setDpr] = useState(() => {
    try {
      const saved = localStorage.getItem('quads_dpr');
      return saved ? parseFloat(saved) : window.devicePixelRatio || 1;
    } catch {
      return window.devicePixelRatio || 1;
    }
  });

  // Calculate opacities based on progress with a sustained "solid" period
  const getOpacity = (start, peakStart, peakEnd, end) => {
    if (htmlProgress < start || htmlProgress > end) return 0;
    if (htmlProgress >= peakStart && htmlProgress <= peakEnd) return 1;
    if (htmlProgress < peakStart) return (htmlProgress - start) / (peakStart - start);
    return 1 - (htmlProgress - peakEnd) / (end - peakEnd);
  };

  const o1 = getOpacity(0.0, 0.05, 0.15, 0.25);
  const o2 = getOpacity(0.2, 0.30, 0.45, 0.55);
  const o3 = getOpacity(0.45, 0.55, 0.75, 0.85);
  const o4 = getOpacity(0.75, 0.85, 1.0, 1.1);

  return (
    <section ref={sectionRef} className="relative w-full bg-brand-darker border-t border-white/5" style={{ height: '400vh' }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* 3D Canvas Layer */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 7], fov: 45 }}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            dpr={dpr}
            style={{ background: 'transparent' }}
          >
            <PerformanceMonitor 
              onIncline={() => setDpr(Math.min(1.2, window.devicePixelRatio || 1))} 
              onDecline={() => setDpr(0.5)} 
            />
            <ambientLight intensity={3.5} />
            <directionalLight position={[5, 5, 5]} intensity={6} color="#ffffff" />
            <pointLight position={[-5, 2, 0]} intensity={35} distance={20} color="#ff6b00" />
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
              <ExplodingBarbell progressRef={progressRef} />
            </Float>
            <Sparkles count={40} scale={10} size={2} speed={0.4} color="#ff8a2a" opacity={0.6} />
          </Canvas>
        </div>

        {/* HTML Overlays Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          
          {/* Page 1: Initial Hook */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: o1, transform: `translateY(${(1 - o1) * 20}px)` }}
          >
            <div className="text-center translate-y-32">
              <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-2">// FORWARD. ALWAYS FORWARD.</span>
              <h2 className="text-3xl md:text-5xl font-display text-white uppercase tracking-wider max-w-2xl mx-auto">
                Sacrifice Now. <span className="text-brand-orange">Rise Forever.</span>
              </h2>
              <p className="text-white/50 mt-4 text-sm uppercase tracking-widest">Scroll Down To Begin</p>
            </div>
          </div>

          {/* Page 2: Tactical Blueprints */}
          <div 
            className="absolute inset-0 flex items-center justify-end px-6 lg:px-24 transition-opacity duration-300"
            style={{ opacity: o2, transform: `translateY(${(1 - o2) * 20}px)` }}
          >
            <div className="w-full md:w-1/2 lg:w-5/12 bg-brand-dark/80 backdrop-blur-md border border-white/10 p-8 pointer-events-auto">
              <span className="text-xs font-accent tracking-widest text-brand-gold uppercase block mb-1">// THE PATH FORWARD</span>
              <h2 className="text-3xl font-display text-white uppercase tracking-wider mb-6">Your Mission, Chosen</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <FaBolt className="text-brand-orange text-2xl shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-display tracking-wider mb-1">STRENGTH BUILDING</h4>
                    <p className="text-white/60 text-xs font-body leading-relaxed">Those who hesitate die weak. Our progressive overload system forges muscle that doesn't lie — earned set by set, rep by rep, session by session.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaCrosshairs className="text-brand-gold text-2xl shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-display tracking-wider mb-1">ATHLETIC POWER</h4>
                    <p className="text-white/60 text-xs font-body leading-relaxed">Speed. Explosiveness. Relentless endurance. If your goal is to become something feared, this programme was built for you.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaShieldAlt className="text-brand-orange text-2xl shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-display tracking-wider mb-1">FAT LOSS & CONDITIONING</h4>
                    <p className="text-white/60 text-xs font-body leading-relaxed">The body you want is on the other side of the pain you avoid. High-intensity, no-mercy conditioning that turns your weakness into fuel.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 3: Why Choose Us (Equipment & Coaches) */}
          <div 
            className="absolute inset-0 flex items-center justify-end px-6 lg:px-24 transition-opacity duration-300"
            style={{ opacity: o3, transform: `translateY(${(1 - o3) * 20}px)` }}
          >
            <div className="w-full md:w-1/2 lg:w-5/12 bg-brand-dark/80 backdrop-blur-md border border-brand-orange/20 p-8 shadow-[0_0_30px_rgba(255,107,0,0.1)] pointer-events-auto">
              <span className="text-xs font-accent tracking-widest text-brand-orange uppercase block mb-1">// PREPARE FOR WAR</span>
              <h2 className="text-3xl font-display text-white uppercase tracking-wider mb-6">The Arsenal</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <FaDumbbell className="text-brand-orange text-2xl shrink-0" />
                  <div>
                    <h3 className="text-white font-display tracking-wider mb-1">Elite Equipment</h3>
                    <p className="text-white/60 text-xs font-body leading-relaxed">A soldier does not go to battle with broken weapons. Our facility is loaded with premium iron — because your effort deserves tools worthy of it.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <FaUsers className="text-brand-gold text-2xl shrink-0" />
                  <div>
                    <h3 className="text-white font-display tracking-wider mb-1">Certified Coaches</h3>
                    <p className="text-white/60 text-xs font-body leading-relaxed">Our coaches have studied the science of the human body so you don't have to guess. They will plan your attack, correct your form, and refuse to let you quit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 4: Why Choose Us (Community & Time) */}
          <div 
            className="absolute inset-0 flex items-center justify-end px-6 lg:px-24 transition-opacity duration-300"
            style={{ opacity: o4, transform: `translateY(${(1 - o4) * 20}px)` }}
          >
            <div className="w-full md:w-1/2 lg:w-5/12 bg-brand-dark/80 backdrop-blur-md border border-white/10 p-8 pointer-events-auto">
              <span className="text-xs font-accent tracking-widest text-brand-gold uppercase block mb-1">// WHERE CHAMPIONS ARE MADE</span>
              <h2 className="text-3xl font-display text-white uppercase tracking-wider mb-6">The Environment</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <FaShieldAlt className="text-brand-orange text-2xl shrink-0" />
                  <div>
                    <h3 className="text-white font-display tracking-wider mb-1">A Brotherhood That Pushes Back</h3>
                    <p className="text-white/60 text-xs font-body leading-relaxed">The greatest soldiers never fight alone. At Quads, you train among people who understand sacrifice — who will push you when your own will falters.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <FaCalendarAlt className="text-brand-gold text-2xl shrink-0" />
                  <div>
                    <h3 className="text-white font-display tracking-wider mb-1">No Rest for the Devoted</h3>
                    <p className="text-white/60 text-xs font-body leading-relaxed">Morning: 5 AM – 10 AM. Evening: 11 AM – 9 PM. Seven days a week. The doors are open. The only question is whether you will walk through them.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <Link to="/programs" className="inline-block btn-aggressive bg-brand-orange text-brand-dark font-accent font-bold uppercase tracking-widest px-8 py-3 text-xs pointer-events-auto">
                  View All Programs
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
