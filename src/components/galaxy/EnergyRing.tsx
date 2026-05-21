'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CommitPosition } from '@/lib/galaxy-coordinates'

interface EnergyRingProps {
  position: CommitPosition | null
  color: string
}

export default function EnergyRing({ position, color }: EnergyRingProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)

  const hue = new THREE.Color(color)

  useFrame((_, delta) => {
    if (!ringRef.current || !ring2Ref.current) return

    ringRef.current.rotation.x += delta * 0.4
    ringRef.current.rotation.z += delta * 0.2

    ring2Ref.current.rotation.x -= delta * 0.3
    ring2Ref.current.rotation.z += delta * 0.5

    const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.05
    ringRef.current.scale.setScalar(pulse)
    ring2Ref.current.scale.setScalar(pulse * 0.8)
  })

  if (!position) return null

  return (
    <group position={[position.position.x, position.position.y, position.position.z]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.8, 0.015, 16, 48]} />
        <meshBasicMaterial
          color={hue}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.6, 0.01, 16, 48]} />
        <meshBasicMaterial
          color={hue}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
