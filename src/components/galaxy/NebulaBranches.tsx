'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { BranchPath } from '@/lib/galaxy-coordinates'

interface NebulaBranchesProps {
  paths: BranchPath[]
}

function BranchTube({ path, color, visible }: { path: BranchPath; color: string; visible: boolean }) {
  const curve = useMemo(() => {
    const points = path.points.map(p => new THREE.Vector3(p.x, p.y, p.z))
    return new THREE.CatmullRomCurve3(points)
  }, [path.points])

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, path.points.length * 4, 0.04, 6, false)
  }, [curve, path.points.length])

  const glowGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, path.points.length * 4, 0.12, 8, false)
  }, [curve, path.points.length])

  const hue = useMemo(() => new THREE.Color(color), [color])
  const glowHue = useMemo(() => new THREE.Color(color).multiplyScalar(0.6), [color])

  return (
    <group visible={visible}>
      <mesh geometry={glowGeo}>
        <meshBasicMaterial
          color={glowHue}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial
          color={hue}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function NebulaBranches({ paths }: NebulaBranchesProps) {
  return (
    <group>
      {paths.map((path) => (
        <BranchTube
          key={path.branch}
          path={path}
          color={path.color}
          visible={true}
        />
      ))}
    </group>
  )
}
