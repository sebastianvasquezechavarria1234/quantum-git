'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function generateParticles(count: number) {
  const pos = new Float32Array(count * 3)
  const vel = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const radius = 15 + Math.random() * 35
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = (Math.random() - 0.5) * 30
    pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    vel[i * 3] = (Math.random() - 0.5) * 0.0003
    vel[i * 3 + 1] = (Math.random() - 0.5) * 0.0003
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.0003
  }
  return { pos, vel }
}

function generateSizes(count: number): Float32Array {
  const s = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    s[i] = 0.02 + Math.random() * 0.06
  }
  return s
}

export default function StarDust({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const { positions, velocities, sizes } = useMemo(() => {
    const { pos, vel } = generateParticles(count)
    const s = generateSizes(count)
    return { positions: pos, velocities: vel, sizes: s }
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [positions, sizes])

  const velocitiesRef = useRef(velocities)

  useFrame((_state, delta) => {
    if (!ref.current) return
    const posAttr = ref.current.geometry.getAttribute('position')
    const array = posAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      array[i * 3] += velocitiesRef.current[i * 3] * delta * 60
      array[i * 3 + 1] += velocitiesRef.current[i * 3 + 1] * delta * 60
      array[i * 3 + 2] += velocitiesRef.current[i * 3 + 2] * delta * 60

      if (Math.abs(array[i * 3]) > 50) velocitiesRef.current[i * 3] *= -1
      if (Math.abs(array[i * 3 + 1]) > 25) velocitiesRef.current[i * 3 + 1] *= -1
      if (Math.abs(array[i * 3 + 2]) > 50) velocitiesRef.current[i * 3 + 2] *= -1
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
