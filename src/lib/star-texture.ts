import * as THREE from 'three'

export function createStarSpriteTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2

  const imageData = ctx.createImageData(size, size)
  const data = imageData.data

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - cx) / maxR
      const dy = (y - cy) / maxR
      const dist = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)

      if (dist > 1) {
        const idx = (y * size + x) * 4
        data[idx] = 0
        data[idx + 1] = 0
        data[idx + 2] = 0
        data[idx + 3] = 0
        continue
      }

      const core = Math.exp(-dist * dist * 6)

      const spikeAngle1 = angle
      const spikeAngle2 = angle + Math.PI / 2
      const spikeWidth = 0.04
      const spikeFalloff = 0.15

      const spike1 = Math.exp(-Math.pow(Math.sin(spikeAngle1) * dist / spikeWidth, 2)) * Math.exp(-dist * spikeFalloff)
      const spike2 = Math.exp(-Math.pow(Math.sin(spikeAngle2) * dist / spikeWidth, 2)) * Math.exp(-dist * spikeFalloff)
      const spikes = Math.max(spike1, spike2)

      const glow = Math.exp(-dist * 1.5) * 0.4

      const brightness = Math.max(core, spikes, glow)
      const color = 1 - Math.exp(-dist * 2) * 0.3

      const idx = (y * size + x) * 4
      data[idx] = Math.min(255, brightness * color * 255)
      data[idx + 1] = Math.min(255, brightness * color * 230)
      data[idx + 2] = Math.min(255, brightness * 255)
      data[idx + 3] = Math.min(255, brightness * 255)
    }
  }

  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function createGlowTexture(size = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.05, 'rgba(255,255,255,0.8)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.3)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.08)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}
