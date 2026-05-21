'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { CommitPosition } from '@/lib/galaxy-coordinates'
import { createStarSpriteTexture, createGlowTexture } from '@/lib/star-texture'

interface CommitStarProps {
  data: CommitPosition
  isSelected: boolean
  isAnimated: boolean
  delay: number
  color: string
  onClick: (sha: string) => void
}

export default function CommitStar({ data, isSelected, isAnimated, delay, color, onClick }: CommitStarProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const startTime = useRef<number>(0)
  const spikeRef = useRef<THREE.Mesh>(null)

  const baseScale = 0.15 + data.magnitude * 0.35
  const hue = useMemo(() => new THREE.Color(color), [color])
  const glowColor = useMemo(() => new THREE.Color(color).multiplyScalar(1.5), [color])

  const starTexture = useMemo(() => createStarSpriteTexture(256), [])
  const glowTexture = useMemo(() => createGlowTexture(128), [])

  useFrame(() => {
    if (!meshRef.current || !glowRef.current || !spikeRef.current) return
    if (startTime.current === 0) startTime.current = Date.now()

    const elapsed = (Date.now() - startTime.current) / 1000

    if (isAnimated) {
      const progress = Math.max(0, Math.min(1, (elapsed - delay) / 0.8))
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const s = baseScale * easeOut
      meshRef.current.scale.setScalar(s)
      glowRef.current.scale.setScalar(s * 2.5)
      spikeRef.current.scale.setScalar(s * 4)

      if (glowRef.current.material && 'opacity' in glowRef.current.material) {
        (glowRef.current.material as THREE.Material).opacity = easeOut * 0.4
      }
      if (meshRef.current.material && 'opacity' in meshRef.current.material) {
        (meshRef.current.material as THREE.Material).opacity = Math.max(0.6, easeOut)
      }
      if (spikeRef.current.material && 'opacity' in spikeRef.current.material) {
        (spikeRef.current.material as THREE.Material).opacity = easeOut * 0.6
      }
      return
    }

    const pulse = 1 + Math.sin(elapsed * 2 + data.index * 0.5) * 0.08
    const scale = baseScale * pulse
    meshRef.current.scale.setScalar(scale)
    glowRef.current.scale.setScalar(scale * 2.5)
    spikeRef.current.scale.setScalar(scale * 4)

    if (glowRef.current.material && 'opacity' in glowRef.current.material) {
      (glowRef.current.material as THREE.Material).opacity = 0.2 + Math.sin(elapsed * 1.5 + data.index) * 0.06
    }
    if (spikeRef.current.material && 'opacity' in spikeRef.current.material) {
      (spikeRef.current.material as THREE.Material).opacity = 0.3 + Math.sin(elapsed * 0.8 + data.index * 0.7) * 0.1
    }
  })

  const size = isSelected ? baseScale * 1.6 : baseScale

  return (
    <group
      position={[data.position.x, data.position.y, data.position.z]}
      onClick={(e) => {
        e.stopPropagation()
        onClick(data.sha)
      }}
    >
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 2.5, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Billboard>
        <mesh ref={spikeRef}>
          <planeGeometry args={[size * 4, size * 4]} />
          <meshBasicMaterial
            map={starTexture}
            transparent
            opacity={0.3}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color={hue}
          />
        </mesh>
      </Billboard>

      <Billboard>
        <mesh>
          <planeGeometry args={[size * 3, size * 3]} />
          <meshBasicMaterial
            map={glowTexture}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color={hue}
          />
        </mesh>
      </Billboard>

      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 24, 24]} />
        <MeshDistortMaterial
          color={hue}
          emissive={hue}
          emissiveIntensity={isSelected ? 1.5 : 0.8}
          roughness={0.15}
          metalness={0.9}
          distort={isSelected ? 0.15 : 0.08}
          speed={2}
          transparent
          opacity={1}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  )
}
