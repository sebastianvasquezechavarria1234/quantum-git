'use client'

import { useRef, useMemo, useEffect } from 'react'
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
  const mouseRef = useRef({ x: 0, y: 0 })

  const particles = useMemo(() => {
    const { pos, vel } = generateParticles(count)
    return { positions: pos, velocities: vel, basePositions: new Float32Array(pos), sizes: generateSizes(count) }
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(particles.sizes, 1))
    return geo
  }, [particles.positions, particles.sizes])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useFrame((_state, delta) => {
    if (!ref.current) return
    const posAttr = ref.current.geometry.getAttribute('position')
    const array = posAttr.array as Float32Array
    const base = particles.basePositions
    const vel = particles.velocities

    const mx = mouseRef.current.x * 2
    const my = mouseRef.current.y * 1.5

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      array[ix] += vel[ix] * delta * 60
      array[iy] += vel[iy] * delta * 60
      array[iz] += vel[iz] * delta * 60

      const dx = array[ix] - base[ix]
      const dy = array[iy] - base[iy]
      const dz = array[iz] - base[iz]
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (dist > 2) {
        array[ix] -= dx * 0.001
        array[iy] -= dy * 0.001
        array[iz] -= dz * 0.001
      }

      const influence = 0.005 / (1 + dist * 0.3)
      array[ix] += mx * influence
      array[iy] += my * influence
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
