import { useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shouldReduce3DQuality } from '../utils/perf'


// Procedural Particle effect representing high-energy gym dust/ambience
function GymParticles({ reduce }) {
  const count = reduce ? 14 : 35

  const points = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4.5
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4.5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2 - 0.3
    }
    return arr
  }, [])

  const ref = useRef()
  const frameSkipRef = useRef(0)
  useFrame((state) => {
    frameSkipRef.current++
    // Throttle CPU-heavy particle updates on low-end.
    if (reduce && frameSkipRef.current % 3 !== 0) return

    const time = state.clock.getElapsedTime()
    const positions = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.0012 + Math.sin(time * 0.45 + i) * 0.0004
      positions[i * 3] += Math.cos(time * 0.25 + i) * 0.0006

      if (positions[i * 3 + 1] > (reduce ? 1.9 : 2.2)) {
        positions[i * 3 + 1] = reduce ? -1.9 : -2.2
        positions[i * 3] = (Math.random() - 0.5) * 4.5
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })


  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        color="#ff6b00"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Skinned mesh muscular arm with bone structure and procedurally parented dumbbell
function RiggedArm({ scrollProgress, reduce }) {
  const groupRef = useRef()
  const materialRef = useRef()


  // 1. Generate procedural textures (fine skin pores bump map + subdermal muscle heat glow)
  const textures = useMemo(() => {
    // Organic Skin Pores & Micro-wrinkles Bump Map
    const bumpCanvas = document.createElement('canvas')
    bumpCanvas.width = 128
    bumpCanvas.height = 128
    const bumpCtx = bumpCanvas.getContext('2d')
    bumpCtx.fillStyle = '#808080'
    bumpCtx.fillRect(0, 0, 128, 128)

    // Skin pores (fine random noise)
    bumpCtx.fillStyle = '#ffffff'
    for (let i = 0; i < 2500; i++) {
      const x = Math.random() * 128
      const y = Math.random() * 128
      const r = 0.4 + Math.random() * 0.8
      bumpCtx.globalAlpha = 0.12 + Math.random() * 0.15
      bumpCtx.beginPath()
      bumpCtx.arc(x, y, r, 0, Math.PI * 2)
      bumpCtx.fill()
    }

    // Micro skin wrinkles running along length (stretch marks / fibers)
    bumpCtx.strokeStyle = '#000000'
    bumpCtx.globalAlpha = 0.05
    bumpCtx.lineWidth = 1
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 128
      bumpCtx.beginPath()
      bumpCtx.moveTo(x, 0)
      bumpCtx.bezierCurveTo(x + 5, 40, x - 5, 80, x, 128)
      bumpCtx.stroke()
    }

    const bumpTex = new THREE.CanvasTexture(bumpCanvas)
    bumpTex.wrapS = THREE.RepeatWrapping
    bumpTex.wrapT = THREE.RepeatWrapping
    bumpTex.repeat.set(10, 20)

    // Organic Subdermal Muscle Glowing Striations
    const emCanvas = document.createElement('canvas')
    emCanvas.width = 128
    emCanvas.height = 256
    const emCtx = emCanvas.getContext('2d')
    emCtx.fillStyle = '#000000'
    emCtx.fillRect(0, 0, 128, 256)

    // Smooth blur filter for organic subdermal scattering look
    emCtx.filter = 'blur(5px)'

    // Draw soft heat signatures representing muscle fibers
    const grad = emCtx.createLinearGradient(0, 0, 0, 256)
    grad.addColorStop(0, '#ff1a00')
    grad.addColorStop(0.5, '#ff5900')
    grad.addColorStop(1, '#ffa600')
    emCtx.strokeStyle = grad

    for (let i = 0; i < 12; i++) {
      const x = 15 + Math.random() * 98
      const startY = Math.random() * 50
      const endY = startY + 70 + Math.random() * 120
      const alpha = 0.35 + Math.random() * 0.55

      emCtx.globalAlpha = alpha
      emCtx.lineWidth = 3 + Math.random() * 8

      emCtx.beginPath()
      emCtx.moveTo(x, startY)
      emCtx.lineTo(x, endY)
      emCtx.stroke()
    }

    const emissiveTex = new THREE.CanvasTexture(emCanvas)
    emissiveTex.wrapS = THREE.RepeatWrapping
    emissiveTex.wrapT = THREE.RepeatWrapping

    return { bumpTex, emissiveTex }
  }, [])

  // 2. Build Skinned Mesh & Armature hierarchy — anatomically sculpted muscular arm
  const { mesh, material, shoulder, elbow, hand } = useMemo(() => {
    const height = 2.4
    // Higher segment counts for smoother muscle contours
    const radialSegs = reduce ? 22 : 48
    const heightSegs = reduce ? 28 : 96
    const geometry = new THREE.CylinderGeometry(0.28, 0.13, height, radialSegs, heightSegs)

    // Geometry Y ranges from +1.2 (shoulder) to -1.2 (wrist)

    const pos = geometry.attributes.position
    const temp = new THREE.Vector3()

    for (let i = 0; i < pos.count; i++) {
      temp.fromBufferAttribute(pos, i)
      const y = temp.y // +1.2 at shoulder, -1.2 at wrist
      const radius = Math.sqrt(temp.x * temp.x + temp.z * temp.z)
      if (radius < 0.001) continue // Skip center vertices

      // Compute angular position around arm (0=+X lateral, PI/2=+Z biceps front, PI=-X medial, 3PI/2=-Z triceps back)
      const angle = Math.atan2(temp.z, temp.x) // -PI to PI

      let offsetX = 0
      let offsetZ = 0
      let scaleR = 1.0 // Radial scale multiplier

      // =====================================================
      // UPPER ARM (y: 1.2 to 0.0) — Shoulder to Elbow
      // =====================================================
      if (y > 0.0) {
        const normY = y / 1.2 // 0 at elbow, 1 at shoulder

        // --- DELTOID SHOULDER CAP ---
        // Large rounded mass at the top of the arm
        if (normY > 0.55) {
          const deltFactor = Math.pow((normY - 0.55) / 0.45, 0.6) // Smooth falloff
          // Deltoid is widest on the lateral side (+X), wraps around front and back
          const deltAngle = Math.cos(angle) * 0.45 + 0.55 // 1.0 at +X, 0.1 at -X (medial)
          scaleR += deltFactor * 0.55 * deltAngle
          // Anterior deltoid (front, towards +Z) 
          if (angle > 0 && angle < Math.PI * 0.7) {
            scaleR += deltFactor * 0.15 * Math.sin(angle)
          }
          // Posterior deltoid (back, towards -Z)
          if (angle < 0 && angle > -Math.PI * 0.7) {
            scaleR += deltFactor * 0.12 * Math.sin(-angle)
          }
        }

        // --- DELTOID-TO-BICEPS TRANSITION (y: 0.55 to 0.75 normalized) ---
        // Deltoid insertion creates a visible notch/pinch on the lateral arm
        if (normY > 0.45 && normY < 0.6) {
          const insertionFactor = Math.sin(Math.PI * (normY - 0.45) / 0.15)
          // Slight inward pinch on the lateral side where deltoid inserts
          if (Math.cos(angle) > 0.3) {
            scaleR -= insertionFactor * 0.06
          }
        }

        // --- BICEPS BRACHII ---
        // Two-headed muscle on the front/medial side of the upper arm
        if (normY < 0.7 && normY > 0.05) {
          const bicepEnvelope = Math.sin(Math.PI * (normY - 0.05) / 0.65) // Bell curve along the length
          // Biceps peak — strongest on the front (+Z) and slightly medial (-X)
          const bicepAngle = Math.max(0, Math.sin(angle)) // Active when angle is 0 to PI (front half)
          const bicepPeak = bicepEnvelope * bicepAngle
          // Long head (lateral bicep) — more towards +X and +Z
          const longHead = bicepEnvelope * Math.max(0, Math.cos(angle - Math.PI * 0.25)) * 0.5
          // Short head (medial bicep) — more towards -X and +Z
          const shortHead = bicepEnvelope * Math.max(0, Math.cos(angle - Math.PI * 0.65)) * 0.35
          
          scaleR += bicepPeak * 0.42
          scaleR += longHead * 0.2
          scaleR += shortHead * 0.18

          // Bicep peak accentuation (highest point slightly above midpoint)
          if (normY > 0.25 && normY < 0.5) {
            const peakBoost = Math.sin(Math.PI * (normY - 0.25) / 0.25)
            scaleR += peakBoost * bicepAngle * 0.12
          }
        }

        // --- TRICEPS (horseshoe shape on the back of the arm) ---
        if (normY < 0.72 && normY > 0.08) {
          const triEnvelope = Math.sin(Math.PI * (normY - 0.08) / 0.64)
          const backAngle = Math.max(0, -Math.sin(angle)) // Active when angle is -PI to 0 (back half)
          
          // Lateral head (outer, visible from side)
          const lateralHead = triEnvelope * Math.max(0, Math.cos(angle + Math.PI * 0.35)) * 0.4
          // Long head (inner, runs down the middle back)
          const longHeadTri = triEnvelope * backAngle * 0.35
          // Medial head (deepest, creates fullness near elbow)
          const medialHead = triEnvelope * Math.max(0, Math.cos(angle + Math.PI * 0.7)) * 0.2
          // Horseshoe depression between lateral and long heads
          const horseshoeDepth = Math.max(0, Math.cos(angle + Math.PI * 0.5))
          const horseshoeNotch = triEnvelope * horseshoeDepth * 0.08 * (normY > 0.3 && normY < 0.55 ? 1 : 0)
          
          scaleR += lateralHead + longHeadTri + medialHead - horseshoeNotch
        }

        // --- BRACHIALIS (outer side, between biceps and triceps) ---
        if (normY < 0.6 && normY > 0.05) {
          const brachEnvelope = Math.sin(Math.PI * (normY - 0.05) / 0.55)
          // Sits on the lateral side (+X), slightly towards front
          const brachAngle = Math.max(0, Math.cos(angle - Math.PI * 0.08))
          scaleR += brachEnvelope * brachAngle * 0.22
        }

        // --- BICIPITAL GROOVE (separation line between anterior deltoid and biceps) ---
        if (normY > 0.4 && normY < 0.75) {
          // Narrow groove on the front-lateral border
          const grooveAngle = Math.exp(-Math.pow((angle - Math.PI * 0.3) / 0.15, 2))
          scaleR -= grooveAngle * 0.04
        }

        // --- VEIN running along the biceps (cephalic vein in the groove) ---
        if (normY < 0.65 && normY > 0.1) {
          const veinPath = Math.exp(-Math.pow((angle - Math.PI * 0.28) / 0.08, 2))
          const veinBulge = Math.sin(Math.PI * (normY - 0.1) / 0.55)
          // Veins sit ON TOP of the muscle — small outward ridge
          offsetX += veinPath * veinBulge * 0.008 * Math.cos(angle)
          offsetZ += veinPath * veinBulge * 0.008 * Math.sin(angle)
          scaleR += veinPath * veinBulge * 0.03
        }

        // --- MEDIAL SIDE (inner arm, towards body, -X) --- 
        // Slightly flatter, less muscular
        if (Math.cos(angle) < -0.5) {
          scaleR -= 0.05 * Math.abs(Math.cos(angle))
        }

      // =====================================================
      // ELBOW REGION (y: 0.0 to -0.15) — Joint transition
      // =====================================================
      } else if (y > -0.15) {
        const elbowNorm = Math.abs(y) / 0.15 // 0 at y=0, 1 at y=-0.15
        // Elbow is bony on the back side — olecranon process
        if (angle < -Math.PI * 0.2 && angle > -Math.PI * 0.8) {
          // Bony protrusion on the back
          const olecranon = Math.max(0, Math.cos(angle + Math.PI * 0.5))
          scaleR -= 0.04 // Narrower at elbow
          offsetZ -= olecranon * 0.012 // Small backward bump (olecranon bone)
        }
        // Cubital fossa (soft indent on the front at the elbow crease)
        if (angle > Math.PI * 0.1 && angle < Math.PI * 0.8) {
          scaleR -= 0.06 * Math.sin(Math.PI * elbowNorm) * Math.sin(angle)
        }
        // General narrowing at the joint
        scaleR -= 0.03 * Math.sin(Math.PI * elbowNorm)

      // =====================================================
      // FOREARM (y: -0.15 to -1.2) — Elbow to Wrist
      // =====================================================
      } else {
        const forearmY = (Math.abs(y) - 0.15) / 1.05 // 0 near elbow, 1 at wrist

        // --- BRACHIORADIALIS (largest forearm muscle, top/lateral near elbow) ---
        if (forearmY < 0.55) {
          const brachRadEnvelope = Math.sin(Math.PI * forearmY / 0.55)
          // Sits on the top-lateral side of the forearm
          const brachRadAngle = Math.max(0, Math.cos(angle - Math.PI * 0.15))
          scaleR += brachRadEnvelope * brachRadAngle * 0.38
          // Peaks heavily near the elbow end
          if (forearmY < 0.2) {
            scaleR += (1 - forearmY / 0.2) * brachRadAngle * 0.15
          }
        }

        // --- WRIST EXTENSORS (back of forearm, -Z side) ---
        if (forearmY < 0.65) {
          const extEnvelope = Math.sin(Math.PI * forearmY / 0.65)
          const extAngle = Math.max(0, -Math.sin(angle)) // Back side
          scaleR += extEnvelope * extAngle * 0.22
          // Extensor carpi ulnaris (inner-back)
          const ecAngle = Math.max(0, Math.cos(angle + Math.PI * 0.65))
          scaleR += extEnvelope * ecAngle * 0.12
        }

        // --- WRIST FLEXORS (front/medial of forearm, +Z towards -X) ---
        if (forearmY < 0.6) {
          const flexEnvelope = Math.sin(Math.PI * forearmY / 0.6)
          // Flexor group sits on the medial-front
          const flexAngle = Math.max(0, Math.sin(angle - Math.PI * 0.15))
          scaleR += flexEnvelope * flexAngle * 0.18
          // Pronator teres (diagonal across top of forearm near elbow)
          if (forearmY < 0.3) {
            const pronatorAngle = Math.max(0, Math.cos(angle - Math.PI * 0.3))
            scaleR += (1 - forearmY / 0.3) * pronatorAngle * 0.1
          }
        }

        // --- FOREARM SEPARATION LINES (visible grooves between muscle groups) ---
        // Groove between brachioradialis and extensors
        if (forearmY < 0.5) {
          const groove1 = Math.exp(-Math.pow((angle + Math.PI * 0.12) / 0.1, 2))
          scaleR -= groove1 * 0.025 * Math.sin(Math.PI * forearmY / 0.5)
        }
        // Groove between flexors and brachioradialis
        if (forearmY < 0.45) {
          const groove2 = Math.exp(-Math.pow((angle - Math.PI * 0.38) / 0.1, 2))
          scaleR -= groove2 * 0.02 * Math.sin(Math.PI * forearmY / 0.45)
        }

        // --- FOREARM VEINS (more prominent than upper arm) ---
        // Cephalic vein continuing down the lateral side
        if (forearmY < 0.7) {
          const veinForearm = Math.exp(-Math.pow((angle - Math.PI * 0.2) / 0.07, 2))
          const veinIntensity = Math.sin(Math.PI * forearmY / 0.7) * 0.8
          scaleR += veinForearm * veinIntensity * 0.025
        }
        // Basilic vein on the medial side
        if (forearmY < 0.6) {
          const basilicVein = Math.exp(-Math.pow((angle + Math.PI * 0.75) / 0.08, 2))
          scaleR += basilicVein * Math.sin(Math.PI * forearmY / 0.6) * 0.02
        }

        // --- WRIST TAPER (smooth, strong taper towards the wrist) ---
        if (forearmY > 0.55) {
          const taperT = (forearmY - 0.55) / 0.45
          scaleR -= taperT * 0.2
          // Wrist tendons become visible (slight ridges)
          if (forearmY > 0.75) {
            const tendonT = (forearmY - 0.75) / 0.25
            // Extensor tendons on the back
            const tendon1 = Math.exp(-Math.pow((angle + Math.PI * 0.3) / 0.12, 2))
            const tendon2 = Math.exp(-Math.pow((angle + Math.PI * 0.55) / 0.12, 2))
            scaleR += (tendon1 + tendon2) * tendonT * 0.015
          }
        }

        // --- ULNA BONE RIDGE (visible on the back-medial forearm) ---
        if (forearmY > 0.2) {
          const ulnaAngle = Math.exp(-Math.pow((angle + Math.PI * 0.85) / 0.1, 2))
          scaleR += ulnaAngle * 0.02 // Subtle ridge
        }
      }

      // Apply transformations
      const finalR = Math.max(0.05, scaleR) // Prevent collapsing
      temp.x = temp.x * finalR + offsetX
      temp.z = temp.z * finalR + offsetZ
      pos.setXYZ(i, temp.x, temp.y, temp.z)
    }
    geometry.computeVertexNormals()

    // Assign skin indices & weights for smooth skeletal blending (Y: 1.2 to -1.2)
    const skinIndices = []
    const skinWeights = []
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      let w0 = 0, w1 = 0, w2 = 0 // w0=shoulder/upper, w1=elbow/forearm, w2=wrist/hand

      if (y >= 0.0) {
        // Upper arm bone influence
        if (y > 0.8) {
          w0 = 1.0
        } else {
          const t = (0.8 - y) / 0.8
          w0 = 1.0 - 0.5 * t
          w1 = 0.5 * t
        }
      } else {
        // Forearm & Hand influence
        if (y > -0.4) {
          const t = Math.abs(y) / 0.4
          w0 = 0.5 * (1.0 - t)
          w1 = 0.5 + 0.5 * t
        } else if (y > -0.9) {
          w1 = 1.0
        } else {
          const t = (Math.abs(y) - 0.9) / 0.3
          w1 = 1.0 - t
          w2 = t
        }
      }

      const sum = w0 + w1 + w2
      skinIndices.push(0, 1, 2, 0)
      skinWeights.push(w0 / sum, w1 / sum, w2 / sum, 0)
    }

    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))

    // Arm skin material (warm bronze flesh tone, non-metallic, semi-glossy)
    const material = new THREE.MeshStandardMaterial({
      color: 0xc99068,       // Warm natural skin tone
      roughness: 0.38,
      metalness: 0.0,
      bumpMap: textures.bumpTex,
      bumpScale: 0.006,
      emissive: 0xb87856,
      emissiveMap: textures.emissiveTex,
      emissiveIntensity: 0.06,
      side: THREE.DoubleSide
    })

    // Modify shader for dynamic muscle contraction during curl
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uElbowCurl = { value: 0 }
      material.userData.currentShader = shader

      shader.vertexShader = `
        uniform float uElbowCurl;
      ` + shader.vertexShader

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>

        // --- BICEPS CONTRACTION (upper arm, front side) ---
        if (position.y > 0.06 && position.y < 1.0) {
          float normY = (position.y - 0.06) / 0.94;
          float envelope = sin(3.14159265 * normY);
          float angle = atan(position.z, position.x);
          
          // Biceps peak rises dramatically when curled
          float bicepAngle = max(0.0, sin(angle));
          float bicepPush = uElbowCurl * envelope * bicepAngle;
          transformed.z += bicepPush * 0.18 * (position.z / max(0.01, length(position.xz)));
          transformed.x += bicepPush * 0.06 * (position.x / max(0.01, length(position.xz)));
          // Biceps bunch up (contract shorter, get taller)
          transformed.y += uElbowCurl * envelope * bicepAngle * 0.06;

          // Brachialis pushes outward on the lateral side
          float brachAngle = max(0.0, cos(angle - 0.08));
          transformed.x += uElbowCurl * envelope * brachAngle * 0.07 * (position.x / max(0.01, length(position.xz)));
          transformed.z += uElbowCurl * envelope * brachAngle * 0.03 * (position.z / max(0.01, length(position.xz)));

          // Triceps flatten/elongate on the back when biceps contract
          float triAngle = max(0.0, -sin(angle));
          transformed.z -= uElbowCurl * envelope * triAngle * 0.03;
        }

        // --- FOREARM PUMP (slight swelling from gripping hard) ---
        if (position.y < -0.15 && position.y > -0.9) {
          float foreY = (abs(position.y) - 0.15) / 0.75;
          float foreEnv = sin(3.14159265 * foreY);
          float pumpScale = uElbowCurl * foreEnv * 0.03;
          transformed.x += pumpScale * (position.x / max(0.01, length(position.xz)));
          transformed.z += pumpScale * (position.z / max(0.01, length(position.xz)));
        }
        `
      )
    }

    // Set up bones hierarchy
    const shoulder = new THREE.Bone()
    shoulder.name = 'shoulder'
    shoulder.position.set(0, 1.2, 0)

    const elbow = new THREE.Bone()
    elbow.name = 'elbow'
    elbow.position.set(0, -1.2, 0)
    shoulder.add(elbow)

    const hand = new THREE.Bone()
    hand.name = 'hand'
    hand.position.set(0, -1.2, 0)
    elbow.add(hand)

    // Sculpted deltoid shoulder cap (ellipsoidal, wider on lateral side)
    const shoulderCapGeo = new THREE.SphereGeometry(0.30, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2)
    // Sculpt the cap to match the deltoid shape
    const capPos = shoulderCapGeo.attributes.position
    const capTemp = new THREE.Vector3()
    for (let i = 0; i < capPos.count; i++) {
      capTemp.fromBufferAttribute(capPos, i)
      const capAngle = Math.atan2(capTemp.z, capTemp.x)
      // Make it wider on the lateral (+X) side
      const lateralScale = 1.0 + Math.max(0, Math.cos(capAngle)) * 0.3
      capTemp.x *= lateralScale
      capTemp.z *= lateralScale * 0.85
      // Slightly elongate upward for a rounded deltoid mass
      capTemp.y *= 1.15
      capPos.setXYZ(i, capTemp.x, capTemp.y, capTemp.z)
    }
    shoulderCapGeo.computeVertexNormals()

    const shoulderCap = new THREE.Mesh(shoulderCapGeo, material)
    shoulderCap.castShadow = true
    shoulderCap.receiveShadow = true
    shoulderCap.position.set(0, 0, 0)
    shoulder.add(shoulderCap)

    const bones = [shoulder, elbow, hand]
    const skeleton = new THREE.Skeleton(bones)

    const mesh = new THREE.SkinnedMesh(geometry, material)
    mesh.add(shoulder)
    mesh.bind(skeleton)
    mesh.castShadow = true
    mesh.receiveShadow = true

    return { mesh, material, shoulder, elbow, hand }
  }, [textures])

  // 3. Generate dumbbell mesh & closed fist
  const { dumbbellGroup, fistGroup } = useMemo(() => {
    const dumbbellGroup = new THREE.Group()

    // Chrome bar/handle
    const handleGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.4, 16)
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.12,
      metalness: 0.95,
      emissive: 0xaaaaaa,
      emissiveIntensity: 0.3,
      bumpMap: textures.bumpTex,
      bumpScale: 0.004
    })
    const handle = new THREE.Mesh(handleGeo, handleMat)
    handle.castShadow = true
    handle.receiveShadow = true
    dumbbellGroup.add(handle)

    // Stacked hex plates material - lighter gray so visible against dark bg
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.3,
      metalness: 0.85,
      emissive: 0x333333,
      emissiveIntensity: 0.4
    })

    // Orange highlight accent rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      emissive: 0xff4500,
      emissiveIntensity: 1.2
    })

    // Left Plates Stack
    const plateL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.055, 6), plateMat)
    plateL1.position.y = -0.125
    plateL1.castShadow = true
    plateL1.receiveShadow = true
    dumbbellGroup.add(plateL1)

    const ringL = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.142, 0.008, 6), ringMat)
    ringL.position.y = -0.095
    dumbbellGroup.add(ringL)

    const plateL2 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.045, 6), plateMat)
    plateL2.position.y = -0.175
    plateL2.castShadow = true
    plateL2.receiveShadow = true
    dumbbellGroup.add(plateL2)

    // Right Plates Stack
    const plateR1 = plateL1.clone()
    plateR1.position.y = 0.125
    dumbbellGroup.add(plateR1)

    const ringR = ringL.clone()
    ringR.position.y = 0.095
    dumbbellGroup.add(ringR)

    const plateR2 = plateL2.clone()
    plateR2.position.y = 0.175
    dumbbellGroup.add(plateR2)

    // Closed Glove/Fist
    const fistGroup = new THREE.Group()
    const fistMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f0f,
      roughness: 0.65,
      metalness: 0.05
    })

    // Palm core
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), fistMat)
    palm.castShadow = true
    palm.receiveShadow = true
    fistGroup.add(palm)

    // Wrapped fingers cylinder
    const fingers = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.08, 12), fistMat)
    fingers.rotation.x = Math.PI / 2
    fingers.position.set(0.024, 0, 0)
    fingers.castShadow = true
    fingers.receiveShadow = true
    fistGroup.add(fingers)

    return { dumbbellGroup, fistGroup }
  }, [textures])

  // 4. Attach Dumbbell & Fist to the hand bone
  useEffect(() => {
    if (hand) {
      hand.add(dumbbellGroup)
      hand.add(fistGroup)

      // Orient dumbbell along Z axis (90deg rotation in local space)
      dumbbellGroup.rotation.x = Math.PI / 2
      dumbbellGroup.position.set(0, 0, 0)
      dumbbellGroup.scale.set(2.0, 2.0, 2.0) // Make dumbbell much bigger and visible

      // Center fist on handle
      fistGroup.position.set(0, -0.01, 0)
      fistGroup.scale.set(1.4, 1.4, 1.4) // Slightly scale fist to match bigger handle
    }

    return () => {
      if (hand) {
        hand.remove(dumbbellGroup)
        hand.remove(fistGroup)
      }
    }
  }, [hand, dumbbellGroup, fistGroup])

  // Clean up materials, geometry & textures on unmount
  useEffect(() => {
    return () => {
      mesh.geometry.dispose()
      material.dispose()
      textures.bumpTex.dispose()
      textures.emissiveTex.dispose()
    }
  }, [mesh, material, textures])

  // 5. Scroll and mouse parallax animation frame updates
  useFrame((state) => {
    const rawScroll = scrollProgress.get() // smooth scroll value (0 to 1)
    // Delay the curl slightly so it starts a bit later.
    const p = Math.min(1.0, Math.max(0.0, (rawScroll - 0.08) * 2.5))


    // Slow mouse parallax rotation
    const mouseX = state.pointer.x * 0.18
    const mouseY = state.pointer.y * 0.14
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.08)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.08)

    // Bone-driven curl transformations:
    // A. Shoulder stabilizer shifts slightly forward
    shoulder.rotation.z = -0.15 * p
    shoulder.rotation.x = 0.05 * p

    // B. Elbow rotates around Z (approx 105 degrees max curl)
    elbow.rotation.z = -0.1 - 1.8 * p

    // C. Wrist flexes slightly for anatomical control
    hand.rotation.z = -0.12 * p

    // D. Update GPU shader uniform for biceps muscle contracting
    if (material.userData.currentShader) {
      material.userData.currentShader.uniforms.uElbowCurl.value = p
    }

    // E. Glowing subdermal heat intensity scales as work increases
    material.emissiveIntensity = 0.05 + p * 0.15
  })

  return (
    <group ref={groupRef} position={[0.12, 0.05, 0]} scale={0.82}>
      <primitive object={mesh} />
    </group>
  )
}

export default function AboutCurlScene({ sectionRef }) {
  const containerRef = useRef(null)
  const reduce = shouldReduce3DQuality()


  // Track scroll through the section
  const { scrollYProgress } = useScroll({
    target: sectionRef || containerRef,
    offset: ['start 85%', 'end 15%']
  })

  // Smooth out scroll progression using a spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.25
  })

  return (
    <div
      ref={containerRef}
      className="about-scene relative mx-auto flex h-[540px] w-full max-w-[680px] items-center justify-center lg:h-[680px]"
    >
      {/* Background decorations removed per user request */}

      {/* R3F Canvas Container - Borderless, floating freely */}
      <div className="absolute inset-0 z-10 h-full w-full">
        <Canvas
          shadows={!reduce}
          camera={{ position: [0, 0, 3.8], fov: 42 }}
          gl={{ antialias: !reduce, alpha: true }}
          dpr={reduce ? [1, 1.25] : 1}
          style={{ background: 'transparent' }}
        >
          {/* Ambient Base Light */}
          <ambientLight intensity={1.5} />

          {/* Main gym overhead light */}
          <spotLight
            position={[2, 4, 3]}
            angle={0.4}
            penumbra={1}
            intensity={3.0}
            castShadow={!reduce}
            shadow-mapSize-width={reduce ? 256 : 1024}
            shadow-mapSize-height={reduce ? 256 : 1024}
          />


          {/* Soft warm fill light for natural skin tone */}
          <directionalLight
            position={[-4, 2, 2]}
            color="#fff0e6"
            intensity={1.2}
          />


          {/* Neutral front light */}
          <directionalLight
            position={[3, 1, 2]}
            color="#ffffff"
            intensity={1.0}
          />

          {/* Skinned arm and dumbbell model */}
          <RiggedArm scrollProgress={smoothProgress} reduce={reduce} />

          {/* Gym ambient particles */}
          <GymParticles reduce={reduce} />


          {/* Transparent plane that receives shadows behind the arm */}
          {!reduce && (
            <mesh position={[0, 0, -0.8]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <shadowMaterial transparent opacity={0.35} />
            </mesh>
          )}

        </Canvas>
      </div>

      {/* HUD Elements Removed */}


    </div>
  )
}