'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BranchPath } from '@/lib/galaxy-coordinates'

const branchVertexShader = `
varying vec2 vUv;
varying float vDist;

void main() {
  vUv = uv;
  vDist = uv.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const branchFragmentShader = `
uniform vec3 uColor;
uniform float uTime;
uniform float uOpacity;

varying vec2 vUv;
varying float vDist;

void main() {
  float flow = sin((vUv.x * 8.0 - uTime * 0.8) * 3.14159) * 0.5 + 0.5;
  float pulse = sin(vUv.x * 20.0 - uTime * 1.2) * 0.3 + 0.7;
  float core = 1.0 - abs(vUv.y - 0.5) * 2.0;
  core = pow(core, 1.5);

  float glow = exp(-abs(vUv.y - 0.5) * 6.0);
  float flowGlow = flow * glow * 0.4;

  float alpha = (core * 0.8 + flowGlow) * pulse * uOpacity;
  alpha = clamp(alpha, 0.0, 1.0);

  vec3 finalColor = uColor * (1.0 + flow * 0.3 + pulse * 0.15);

  gl_FragColor = vec4(finalColor, alpha);
}
`

function BranchTube({ path, color, visible }: { path: BranchPath; color: string; visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  const curve = useMemo(() => {
    const points = path.points.map(p => new THREE.Vector3(p.x, p.y, p.z))
    return new THREE.CatmullRomCurve3(points)
  }, [path.points])

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uTime: { value: 0 },
    uOpacity: { value: 0.7 },
  }), [color])

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, path.points.length * 4, 0.04, 6, false)
  }, [curve, path.points.length])

  const glowGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, path.points.length * 4, 0.2, 8, false)
  }, [curve, path.points.length])

  useFrame((_, delta) => {
    timeRef.current += delta
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = timeRef.current
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = timeRef.current
    }
  })

  return (
    <group visible={visible}>
      <mesh ref={glowRef} geometry={glowGeo}>
        <shaderMaterial
          uniforms={{
            uColor: { value: new THREE.Color(color).multiplyScalar(0.5) },
            uTime: { value: 0 },
            uOpacity: { value: 0.15 },
          }}
          vertexShader={branchVertexShader}
          fragmentShader={branchFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={meshRef} geometry={tubeGeo}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={branchVertexShader}
          fragmentShader={branchFragmentShader}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

interface NebulaBranchesProps {
  paths: BranchPath[]
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
