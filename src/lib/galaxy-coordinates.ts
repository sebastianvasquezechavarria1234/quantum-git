import { CommitNode, BranchData } from './github'

export interface Point3D {
  x: number
  y: number
  z: number
}

export interface CommitPosition {
  sha: string
  position: Point3D
  branch: string
  magnitude: number
  index: number
}

export interface BranchPath {
  branch: string
  color: string
  points: Point3D[]
}

export interface GalaxyLayout {
  commits: CommitPosition[]
  branchPaths: BranchPath[]
  center: Point3D
  scale: number
}

const SPIRAL_TURNS = 2.5
const HEIGHT_SPREAD = 15
const RADIAL_SPREAD = 8
const MAIN_RADIUS = 2
function getBranchAngle(branchName: string, totalBranches: number, branchIndex: number): number {
  if (branchName === 'main' || branchName === 'master') return 0
  const baseAngle = (branchIndex / totalBranches) * Math.PI * 2
  const branchSpecific = (hashCode(branchName) % 360) / 360 * Math.PI * 2
  return baseAngle + branchSpecific * 0.3
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function spiralPoint(
  t: number,
  angle: number,
  radius: number,
  heightScale: number,
  radialScale: number,
): Point3D {
  const r = radius + t * radialScale
  const theta = angle + t * SPIRAL_TURNS * Math.PI * 2
  const y = t * heightScale - heightScale / 2
  return {
    x: r * Math.cos(theta),
    y,
    z: r * Math.sin(theta),
  }
}

export function computeGalaxyLayout(
  commits: CommitNode[],
  branches: BranchData[],
): GalaxyLayout {
  const sorted = [...commits].sort((a, b) => a.date.getTime() - b.date.getTime())
  const total = sorted.length
  if (total === 0) return { commits: [], branchPaths: [], center: { x: 0, y: 0, z: 0 }, scale: 1 }

  const maxChanges = Math.max(...sorted.map(c => c.additions + c.deletions), 1)

  const branchAngles = new Map<string, { angle: number; index: number }>()
  branches.forEach((b, i) => {
    branchAngles.set(b.name, {
      angle: getBranchAngle(b.name, branches.length, i),
      index: i,
    })
  })

  const branchCommits = new Map<string, CommitNode[]>()
  sorted.forEach(c => {
    const list = branchCommits.get(c.branch) ?? []
    list.push(c)
    branchCommits.set(c.branch, list)
  })

  const positions: CommitPosition[] = []
  const branchPaths: BranchPath[] = []

  branchCommits.forEach((branchCommitList, branchName) => {
    const branchInfo = branchAngles.get(branchName)
    const angle = !branchInfo || branchName === 'main' || branchName === 'master'
      ? 0
      : branchInfo.angle
    const radius = branchName === 'main' || branchName === 'master'
      ? MAIN_RADIUS
      : MAIN_RADIUS + 1.5 + (branchInfo?.index ?? 0) * 1.2

    const branchColor = branches.find(b => b.name === branchName)?.color ?? '#8b5cf6'

    const branchPositions: Point3D[] = []

    branchCommitList.forEach((commit, i) => {
      const globalIndex = sorted.indexOf(commit)
      const t = globalIndex / Math.max(total - 1, 1)
      const magnitude = (commit.additions + commit.deletions) / maxChanges

      let pos: Point3D
      if (branchName === 'main' || branchName === 'master') {
        pos = spiralPoint(t, 0, MAIN_RADIUS, HEIGHT_SPREAD, 0.3)
      } else {
        const branchT = i / Math.max(branchCommitList.length - 1, 1)
        const radialOffset = branchT * RADIAL_SPREAD * 0.6
        const currentRadius = radius + radialOffset
        const spiralOffset = t * 0.8
        pos = spiralPoint(t, angle + spiralOffset, currentRadius, HEIGHT_SPREAD, 0.2)
      }

      branchPositions.push(pos)

      positions.push({
        sha: commit.sha,
        position: pos,
        branch: branchName,
        magnitude,
        index: globalIndex,
      })
    })

    const mainBranch = branches.find(b => b.name === 'main' || b.name === 'master')
    if (mainBranch && branchName !== 'main' && branchName !== 'master') {
    }

    if (branchPositions.length >= 2) {
      const curved: Point3D[] = []
      const steps = branchPositions.length * 8
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const idx = t * (branchPositions.length - 1)
        const idx0 = Math.floor(idx)
        const idx1 = Math.min(idx0 + 1, branchPositions.length - 1)
        const frac = idx - idx0

        const p0 = branchPositions[idx0]
        const p1 = branchPositions[idx1]

        if (!p0 || !p1) continue

        const cpOffset = 0.15
        const cp0: Point3D = {
          x: lerp(p0.x, p1.x, cpOffset),
          y: lerp(p0.y, p1.y, cpOffset),
          z: lerp(p0.z, p1.z, cpOffset),
        }
        const cp1: Point3D = {
          x: lerp(p0.x, p1.x, 1 - cpOffset),
          y: lerp(p0.y, p1.y, 1 - cpOffset),
          z: lerp(p0.z, p1.z, 1 - cpOffset),
        }

        const u = 1 - frac
        const uu = u * u
        const uuu = uu * u
        const ff = 3 * uu * frac
        const fff = 3 * u * frac * frac
        const ffff = frac * frac * frac

        curved.push({
          x: uuu * p0.x + ff * cp0.x + fff * cp1.x + ffff * p1.x,
          y: uuu * p0.y + ff * cp0.y + fff * cp1.y + ffff * p1.y,
          z: uuu * p0.z + ff * cp0.z + fff * cp1.z + ffff * p1.z,
        })
      }
      branchPaths.push({
        branch: branchName,
        color: branchColor,
        points: curved,
      })
    } else if (branchPositions.length === 1) {
      branchPaths.push({
        branch: branchName,
        color: branchColor,
        points: branchPositions,
      })
    }
  })

  positions.sort((a, b) => a.index - b.index)

  const center: Point3D = { x: 0, y: 0, z: 0 }

  return {
    commits: positions,
    branchPaths,
    center,
    scale: 1,
  }
}
