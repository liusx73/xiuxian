import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../game/store'
import { REALMS, MONSTERS } from '../../game/constants'

function DamageText({ text, position, color }: { text: string; position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null)
  const [opacity, setOpacity] = useState(1)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.position.y += delta * 1.5
    setOpacity((prev) => Math.max(0, prev - delta * 1.5))
  })

  if (opacity <= 0) return null

  return (
    <group ref={ref} position={position}>
      <Text fontSize={0.2} color={color} anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  )
}

function PlayerCharacter({ attacking, realmColor }: { attacking: boolean; realmColor: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const attackRef = useRef(0)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (attacking) {
      attackRef.current += delta * 10
      if (attackRef.current < Math.PI) {
        groupRef.current.position.x = -1.5 + Math.sin(attackRef.current) * 1.0
      } else {
        attackRef.current = 0
        groupRef.current.position.x = -1.5
      }
    } else {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[-1.5, 0, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.2, 0.5, 8, 16]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#e8c39e" roughness={0.6} />
      </mesh>
      {/* Sword */}
      <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.04, 0.6, 0.02]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.8} roughness={0.2} />
      </mesh>
      <pointLight color={realmColor} intensity={1.5} distance={3} position={[0, 0.5, 0]} />
    </group>
  )
}

function MonsterModel({ monsterIndex, hit }: { monsterIndex: number; hit: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const hitRef = useRef(0)

  const monsterColor = useMemo(() => {
    const colors = ['#8B4513', '#2E8B57', '#B22222', '#4169E1', '#FFD700', '#8B008B', '#FF4500', '#00CED1', '#2F4F4F', '#DC143C']
    return colors[monsterIndex % colors.length]
  }, [monsterIndex])

  const monster = MONSTERS[monsterIndex]
  const scale = 0.8 + monsterIndex * 0.1

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (hit) {
      hitRef.current += delta * 8
      if (hitRef.current < Math.PI) {
        groupRef.current.position.x = 1.5 + Math.sin(hitRef.current) * 0.2
      } else {
        hitRef.current = 0
      }
    }
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1
  })

  return (
    <group ref={groupRef} position={[1.5, 0, 0]} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color={monsterColor} roughness={0.6} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 0.6, 0.3]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.15, 0.6, 0.3]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <Float speed={3} floatIntensity={0.1}>
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.15}
          color="#ff6666"
          anchorX="center"
          anchorY="middle"
        >
          {monster?.name ?? '???'}
        </Text>
      </Float>
    </group>
  )
}

function BattleGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
      <planeGeometry args={[10, 6]} />
      <meshStandardMaterial color="#1a1a2e" roughness={1} />
    </mesh>
  )
}

function BattleContent() {
  const battle = useGameStore((s) => s.battle)
  const realmIndex = useGameStore((s) => s.player.realmIndex)
  const realmColor = REALMS[realmIndex].color
  const [showDamage, setShowDamage] = useState(false)

  useFrame(() => {
    if (battle.active && Date.now() - battle.lastAttackTime < 300) {
      if (!showDamage) setShowDamage(true)
    } else {
      if (showDamage) setShowDamage(false)
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 3]} intensity={0.8} />
      <Stars radius={50} depth={30} count={500} factor={2} fade speed={0.5} />

      <PlayerCharacter attacking={battle.active} realmColor={realmColor} />

      {battle.active && (
        <MonsterModel monsterIndex={battle.monsterIndex} hit={showDamage} />
      )}

      {showDamage && (
        <DamageText text="Hit!" position={[1.5, 1.5, 0]} color="#ff4444" />
      )}

      <BattleGround />
    </>
  )
}

export default function BattleScene() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <BattleContent />
      </Canvas>
    </div>
  )
}
