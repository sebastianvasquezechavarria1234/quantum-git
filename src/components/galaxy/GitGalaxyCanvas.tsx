'use client'

import { Suspense, useCallback, useMemo, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import CommitStar from './CommitStar'
import NebulaBranches from './NebulaBranches'
import StarDust from './StarDust'
import { computeGalaxyLayout } from '@/lib/galaxy-coordinates'
import { GalaxyData } from '@/lib/github'

interface GalaxySceneProps {
  data: GalaxyData
  selectedSha: string | null
  onSelectCommit: (sha: string) => void
  isPlaying: boolean
}

function GalaxyInner({
  data,
  selectedSha,
  onSelectCommit,
  isPlaying,
}: GalaxySceneProps) {
  const layout = useMemo(() => computeGalaxyLayout(data.commits, data.branches), [data])
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null)

  const branchColorMap = useMemo(() => {
    const map = new Map<string, string>()
    data.branches.forEach(b => map.set(b.name, b.color))
    return map
  }, [data])

  const selectedPosition = useMemo(() => {
    if (!selectedSha) return null
    return layout.commits.find(c => c.sha === selectedSha)?.position ?? null
  }, [selectedSha, layout.commits])

  useEffect(() => {
    if (!selectedPosition || !controlsRef.current) return
    const pos = new THREE.Vector3(selectedPosition.x, selectedPosition.y, selectedPosition.z)
    const offset = new THREE.Vector3(3, 2, 5)
    controlsRef.current.object.position.lerp(pos.clone().add(offset), 0.1)
    controlsRef.current.target.lerp(pos, 0.1)
    controlsRef.current.update()
  }, [selectedPosition])

  const handleClick = useCallback((sha: string) => {
    onSelectCommit(sha)
  }, [onSelectCommit])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        panSpeed={0.4}
        minDistance={3}
        maxDistance={40}
      />

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[-10, -5, -10]} intensity={0.4} color="#06b6d4" />
      <pointLight position={[0, 10, -10]} intensity={0.3} color="#ec4899" />

      <fogExp2 attach="fog" args={['#0a0a0c', 0.008]} />

      <NebulaBranches paths={layout.branchPaths} />

      {layout.commits.map((pos) => (
        <CommitStar
          key={pos.sha}
          data={pos}
          isSelected={selectedSha === pos.sha}
          isAnimated={isPlaying}
          delay={pos.index * 0.03}
          color={branchColorMap.get(pos.branch) ?? '#8b5cf6'}
          onClick={handleClick}
        />
      ))}

      <StarDust count={2500} />
    </>
  )
}

export default function GitGalaxyCanvas(props: GalaxySceneProps) {
  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <GalaxyInner {...props} />
      </Suspense>
    </Canvas>
  )
}
