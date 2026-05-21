'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

varying vec2 vUv;
varying vec3 vPosition;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.015;

  vec2 p = uv * 3.0;
  p.x += t * 0.2;
  p.y += t * 0.1;

  float n1 = fbm(p);
  float n2 = fbm(p * 1.5 + vec2(1.2, 0.8));
  float n3 = fbm(p * 2.0 + vec2(2.5, 1.3));

  vec3 col1 = mix(uColor1, uColor2, n1);
  vec3 col2 = mix(uColor3, uColor4, n2);
  vec3 finalColor = mix(col1, col2, n3);

  float alpha = 0.6 + 0.4 * n3;
  float vignette = 1.0 - length(uv - 0.5) * 0.4;

  gl_FragColor = vec4(finalColor * vignette, alpha);
}
`

export default function NebulaSkybox() {
  const meshRef = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#0a0015') },
    uColor2: { value: new THREE.Color('#1a0030') },
    uColor3: { value: new THREE.Color('#0d0d2b') },
    uColor4: { value: new THREE.Color('#150022') },
  }), [])

  useFrame((_, delta) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value += delta
    }
  })

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[80, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        fog={false}
      />
    </mesh>
  )
}
