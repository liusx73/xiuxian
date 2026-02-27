import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../game/store'
import { REALMS } from '../../game/constants'

function QiParticles({ color, count }: { color: string; count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 1.2 + Math.random() * 1.5,
      speed: 0.3 + Math.random() * 0.7,
      y: -0.5 + Math.random() * 2,
      ySpeed: 0.2 + Math.random() * 0.5,
    }))
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    particles.forEach((p, i) => {
      const angle = p.angle + t * p.speed
      const r = p.radius + Math.sin(t * p.ySpeed) * 0.3
      dummy.position.set(
        Math.cos(angle) * r,
        p.y + Math.sin(t * p.ySpeed + i) * 0.5,
        Math.sin(angle) * r
      )
      dummy.scale.setScalar(0.03 + Math.sin(t * 2 + i) * 0.015)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  )
}

function MeditatingFigure({ realmColor }: { realmColor: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.25, 0.5, 8, 16]} />
        <meshStandardMaterial color="#4a3728" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#e8c39e" roughness={0.6} />
      </mesh>
      {/* Legs crossed */}
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.1, 8, 16]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
      </mesh>
      {/* Aura glow */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial color={realmColor} transparent opacity={0.08} />
      </mesh>
      <pointLight color={realmColor} intensity={2} distance={5} position={[0, 0.5, 0]} />
    </group>
  )
}

function LotusBase() {
  return (
    <group position={[0, -0.5, 0]}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}
            rotation={[0.3, angle, 0.5]}
          >
            <boxGeometry args={[0.3, 0.02, 0.5]} />
            <meshStandardMaterial color="#e91e8c" transparent opacity={0.6} roughness={0.3} />
          </mesh>
        )
      })}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="#c2185b" roughness={0.4} />
      </mesh>
    </group>
  )
}

function SceneContent() {
  const realmIndex = useGameStore((s) => s.player.realmIndex)
  const realm = REALMS[realmIndex]
  const particleCount = 40 + realmIndex * 20

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 2]} intensity={0.6} />
      <Stars radius={50} depth={30} count={1000} factor={3} fade speed={1} />

      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
        <MeditatingFigure realmColor={realm.color} />
        <LotusBase />
      </Float>

      <QiParticles color={realm.color} count={particleCount} />

      <Text
        position={[0, 2.2, 0]}
        fontSize={0.25}
        color={realm.color}
        anchorX="center"
        anchorY="middle"
      >
        {realm.name}
      </Text>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#1a0a2e" transparent opacity={0.5} />
      </mesh>
    </>
  )
}

export default function CultivationScene() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}
