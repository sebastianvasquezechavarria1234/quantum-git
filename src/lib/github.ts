export interface CommitAuthor {
  name: string
  email: string
  avatar: string
  login: string
}

export interface CommitFile {
  filename: string
  status: 'added' | 'modified' | 'removed'
  additions: number
  deletions: number
  patch?: string
}

export interface CommitNode {
  sha: string
  author: CommitAuthor
  date: Date
  message: string
  branch: string
  parents: string[]
  files: CommitFile[]
  additions: number
  deletions: number
}

export interface BranchData {
  name: string
  color: string
  headSha: string
}

export interface RepoData {
  owner: string
  name: string
  description: string
  stars: number
  forks: number
  url: string
}

export interface GalaxyData {
  repo: RepoData
  branches: BranchData[]
  commits: CommitNode[]
}

const BRANCH_COLORS: Record<string, string> = {
  main: '#8b5cf6',
  master: '#8b5cf6',
  develop: '#06b6d4',
}

function getBranchColor(name: string): string {
  return BRANCH_COLORS[name] ?? `hsl(${Math.abs(hashCode(name)) % 360}, 80%, 60%)`
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

const MOCK_AUTHORS: CommitAuthor[] = [
  { name: 'Sarah Chen', email: 'sarah@quantum.dev', avatar: 'SC', login: 'sarahchen' },
  { name: 'Marcus Webb', email: 'marcus@quantum.dev', avatar: 'MW', login: 'marcuswebb' },
  { name: 'Elena Rodriguez', email: 'elena@quantum.dev', avatar: 'ER', login: 'elenarod' },
  { name: 'Alex Kim', email: 'alex@quantum.dev', avatar: 'AK', login: 'alexkim' },
  { name: 'Jordan Blake', email: 'jordan@quantum.dev', avatar: 'JB', login: 'jordanblake' },
]

const MOCK_FILES: CommitFile[][] = [
  [{ filename: 'src/core/quantum.ts', status: 'added', additions: 245, deletions: 0, patch: '+ export class QuantumEngine {\n+   async compute(input: Qubit[]): Promise<Result> {\n+     return this.entangle(input);\n+   }\n+ }' }],
  [{ filename: 'src/core/entanglement.ts', status: 'added', additions: 180, deletions: 0, patch: '+ export function entangle(qubits: Qubit[]): Qubit[] {\n+   return qubits.map(q => q.superpose());\n+ }' }],
  [{ filename: 'src/utils/matrix.ts', status: 'modified', additions: 34, deletions: 12, patch: '@@ -45,7 +45,9 @@ export function multiply(a: Matrix, b: Matrix) {\n-  return basicMultiply(a, b);\n+  if (a.isSparse && b.isSparse) {\n+    return sparseMultiply(a, b);\n+  }\n+  return basicMultiply(a, b);\n }' }],
  [{ filename: 'README.md', status: 'modified', additions: 15, deletions: 3, patch: '+ ## Quantum Git\n+ Visualize your repository as a 3D galaxy.' }],
  [{ filename: 'src/api/github.ts', status: 'added', additions: 89, deletions: 0 }],
  [{ filename: 'src/components/Canvas.tsx', status: 'modified', additions: 45, deletions: 20, patch: '@@ -12,7 +12,11 @@ export function Canvas() {\n+  const { camera } = useThree();\n+  camera.position.set(0, 5, 10);\n }' }],
  [{ filename: 'src/styles/globals.css', status: 'modified', additions: 8, deletions: 2 }],
  [{ filename: 'package.json', status: 'modified', additions: 5, deletions: 1 }],
  [{ filename: 'tsconfig.json', status: 'modified', additions: 3, deletions: 1 }],
  [{ filename: 'src/hooks/useGalaxy.ts', status: 'added', additions: 67, deletions: 0 }],
  [{ filename: 'src/utils/coordinates.ts', status: 'added', additions: 120, deletions: 0 }],
  [{ filename: 'src/components/Star.tsx', status: 'modified', additions: 28, deletions: 10 }],
  [{ filename: 'src/types/commit.ts', status: 'added', additions: 42, deletions: 0 }],
  [{ filename: '.github/workflows/deploy.yml', status: 'added', additions: 35, deletions: 0 }],
  [{ filename: 'src/lib/galaxy.ts', status: 'modified', additions: 55, deletions: 15 }],
  [{ filename: 'src/components/OrbitControls.tsx', status: 'modified', additions: 12, deletions: 4 }],
  [{ filename: 'src/components/Telemetry.tsx', status: 'added', additions: 95, deletions: 0 }],
  [{ filename: 'src/components/Timeline.tsx', status: 'added', additions: 110, deletions: 0 }],
  [{ filename: 'tests/galaxy.test.ts', status: 'added', additions: 78, deletions: 0 }],
  [{ filename: 'docs/ARCHITECTURE.md', status: 'added', additions: 200, deletions: 0 }],
  [{ filename: 'src/core/processor.ts', status: 'modified', additions: 40, deletions: 25 }],
  [{ filename: 'src/components/Lighting.tsx', status: 'added', additions: 30, deletions: 0 }],
  [{ filename: 'src/hooks/useAnimation.ts', status: 'added', additions: 55, deletions: 0 }],
  [{ filename: 'src/components/CameraController.tsx', status: 'added', additions: 65, deletions: 0 }],
  [{ filename: 'src/lib/constants.ts', status: 'modified', additions: 10, deletions: 2 }],
  [{ filename: 'src/utils/spiral.ts', status: 'added', additions: 85, deletions: 0 }],
  [{ filename: 'src/components/BranchLine.tsx', status: 'modified', additions: 22, deletions: 8 }],
  [{ filename: 'src/components/CommitTooltip.tsx', status: 'added', additions: 75, deletions: 0 }],
  [{ filename: 'src/components/ParticleField.tsx', status: 'added', additions: 60, deletions: 0 }],
  [{ filename: 'src/workers/galaxy.worker.ts', status: 'added', additions: 45, deletions: 0 }],
  [{ filename: 'jest.config.ts', status: 'modified', additions: 6, deletions: 2 }],
  [{ filename: 'src/components/LoadingScreen.tsx', status: 'added', additions: 40, deletions: 0 }],
  [{ filename: 'src/components/ErrorBoundary.tsx', status: 'added', additions: 35, deletions: 0 }],
  [{ filename: 'src/lib/queryClient.ts', status: 'added', additions: 50, deletions: 0 }],
  [{ filename: 'src/store/galaxyStore.ts', status: 'added', additions: 80, deletions: 0 }],
  [{ filename: 'src/components/SearchBar.tsx', status: 'added', additions: 70, deletions: 0 }],
  [{ filename: 'src/components/RepoInfo.tsx', status: 'added', additions: 45, deletions: 0 }],
  [{ filename: 'src/lib/mockData.ts', status: 'modified', additions: 30, deletions: 10 }],
]

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateMockCommits(): CommitNode[] {
  const random = seededRandom(42)
  const commits: CommitNode[] = []
  const baseDate = new Date('2025-06-01T09:00:00Z')
  const commitMessages: string[] = [
    'Initial commit: project scaffold',
    'Add core quantum engine with entanglement',
    'Implement matrix operations with sparse support',
    'Fix README typos and add badges',
    'Add GitHub API integration layer',
    'Update Canvas component with R3F',
    'Style globals with dark theme',
    'Bump dependencies in package.json',
    'Configure TypeScript strict mode',
    'Add useGalaxy hook for coordinate management',
    'Implement spiral coordinate mapping',
    'Animate star glow intensity',
    'Add CommitFile and BranchData types',
    'Set up CI/CD deployment workflow',
    'Refactor galaxy lib with new math',
    'Fix OrbitControls damping',
    'Add Telemetry panel component',
    'Build TimelinePlayer with play controls',
    'Write galaxy coordinate tests',
    'Document architecture in ARCHITECTURE.md',
    'Optimize quantum processor pipeline',
    'Add dynamic lighting system',
    'Create useAnimation hook for transitions',
    'Implement cinematic camera controller',
    'Update constants with new values',
    'Refactor spiral math utilities',
    'Style branch lines with gradients',
    'Add commit tooltip on hover',
    'Create particle field background',
    'Add web worker for galaxy computation',
    'Update Jest configuration',
    'Add loading screen component',
    'Implement error boundary',
    'Set up React Query client',
    'Create Zustand galaxy store',
    'Add repository search bar',
    'Build repo info panel',
    'Refactor mock data generator',
    'Fix entanglement edge case',
    'Optimize rendering with instancing',
    'Add keyboard shortcuts',
    'Implement camera bookmarks',
    'Add branch filter UI',
    'Fix timeline sync issue',
    'Add commit diff viewer',
    'Improve performance with memo',
    'Add zoom-to-fit on selection',
    'Create export snapshot feature',
    'Fix color mapping for branches',
    'Add tutorial overlay',
    'Polish animations and transitions',
  ]

  function getRandomAuthor(): CommitAuthor {
    return MOCK_AUTHORS[Math.floor(random() * MOCK_AUTHORS.length)]
  }

  function getRandomFiles(): CommitFile[] {
    return MOCK_FILES[Math.floor(random() * MOCK_FILES.length)]
  }

  function makeHash(index: number, branch: string): string {
    const seed = `${index}-${branch}-quantum-git`
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash).toString(16).padStart(40, '0').slice(0, 40)
  }

  const selectedMessages = commitMessages.slice(0, 55)
  const branchOrder: string[] = ['main', 'develop', 'feature/quantum-core', 'feature/visualization', 'feature/api-integration', 'feature/testing', 'feature/performance', 'hotfix/memory-leak', 'feature/telemetry', 'feature/timeline', 'feature/particles', 'feature/optimization', 'release/v0.2.0', 'release/v0.3.0', 'feature/collaboration', 'feature/mobile-support', 'hotfix/crash-fix', 'feature/docs']

  const branchSequence: { msgIndex: number; branch: string; parentIndex: number | null }[] = []

  let mainCount = 0
  branchOrder.forEach((branch) => {
    const count = branch === 'main' ? 8 : branch.startsWith('release/') ? 3 : branch.startsWith('hotfix/') ? 2 : 3
    for (let i = 0; i < count; i++) {
      branchSequence.push({
        msgIndex: Math.min(mainCount++, selectedMessages.length - 1),
        branch,
        parentIndex: branchSequence.length > 0 ? branchSequence.length - 1 : null,
      })
    }
    if (branch !== 'main') {
      const mergeMsgIndex = Math.min(mainCount++, selectedMessages.length - 1)
      branchSequence.push({
        msgIndex: mergeMsgIndex,
        branch: 'main',
        parentIndex: branchSequence.length > 0 ? branchSequence.length - 1 : null,
      })
    }
  })

  branchSequence.forEach((entry, idx) => {
    const msg = selectedMessages[entry.msgIndex % selectedMessages.length]
    const date = new Date(baseDate.getTime() + idx * 3600000 * (2 + Math.floor(random() * 4)))
    const author = getRandomAuthor()
    const files = getRandomFiles()
    const add = files.reduce((a, f) => a + f.additions, 0)
    const del = files.reduce((a, f) => a + f.deletions, 0)

    commits.push({
      sha: makeHash(idx, entry.branch),
      author,
      date,
      message: msg,
      branch: entry.branch,
      parents: entry.parentIndex !== null ? [commits[entry.parentIndex].sha] : [],
      files,
      additions: add,
      deletions: del,
    })
  })

  return commits
}

export function getMockGalaxyData(): GalaxyData {
  const commits = generateMockCommits()
  const branchMap = new Map<string, string>()

  commits.forEach(c => {
    if (!branchMap.has(c.branch)) {
      branchMap.set(c.branch, getBranchColor(c.branch))
    }
  })

  const branches: BranchData[] = Array.from(branchMap.entries()).map(([name, color]) => ({
    name,
    color,
    headSha: [...commits].reverse().find(c => c.branch === name)?.sha ?? commits[0].sha,
  }))

  return {
    repo: {
      owner: 'quantum-dev',
      name: 'quantum-git',
      description: '3D Git commit visualization as an explorable galaxy',
      stars: 1284,
      forks: 342,
      url: 'https://github.com/quantum-dev/quantum-git',
    },
    branches,
    commits,
  }
}

interface GHFile {
  filename: string
  status: string
  additions: number
  deletions: number
  patch?: string
}

interface GHCommitDetail {
  files?: GHFile[]
}

interface GHCommit {
  sha: string
  commit: {
    author?: { name?: string; email?: string; date?: string }
    message: string
  }
  author?: { avatar_url?: string; login?: string }
  parents?: { sha: string }[]
  url: string
}

interface GHBranch {
  name: string
  commit: { sha: string }
}

interface GHRepo {
  owner?: { login?: string }
  name: string
  description?: string
  stargazers_count?: number
  forks_count?: number
  html_url?: string
}

export async function fetchRepoData(owner: string, repo: string): Promise<GalaxyData> {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const base = `https://api.github.com/repos/${owner}/${repo}`

  const [repoRes, branchesRes, commitsRes] = await Promise.all([
    fetch(base, { headers }),
    fetch(`${base}/branches`, { headers }),
    fetch(`${base}/commits?per_page=100`, { headers }),
  ])

  if (!repoRes.ok || !branchesRes.ok || !commitsRes.ok) {
    throw new Error('Failed to fetch repository data')
  }

  const repoData = (await repoRes.json()) as GHRepo
  const branchesData = (await branchesRes.json()) as GHBranch[]
  const commitsData = (await commitsRes.json()) as GHCommit[]

  const branches: BranchData[] = branchesData.map((b) => ({
    name: b.name,
    color: getBranchColor(b.name),
    headSha: b.commit.sha,
  }))

  const commits: CommitNode[] = await Promise.all(
    commitsData.map(async (c) => {
      const commitRes = await fetch(c.url, { headers })
      const detail = (await commitRes.json()) as GHCommitDetail

      const files: CommitFile[] = (detail.files ?? []).map((f) => ({
        filename: f.filename,
        status: f.status as CommitFile['status'],
        additions: f.additions,
        deletions: f.deletions,
        patch: f.patch,
      }))

      return {
        sha: c.sha,
        author: {
          name: c.commit.author?.name ?? 'Unknown',
          email: c.commit.author?.email ?? '',
          avatar: c.author?.avatar_url ?? '',
          login: c.author?.login ?? '',
        },
        date: new Date(c.commit.author?.date ?? Date.now()),
        message: c.commit.message,
        branch: '',
        parents: c.parents?.map((p) => p.sha) ?? [],
        files,
        additions: files.reduce((a, f) => a + f.additions, 0),
        deletions: files.reduce((a, f) => a + f.deletions, 0),
      }
    })
  )

  commits.forEach((commit) => {
    for (const branch of branches) {
      if (commit.sha === branch.headSha || commits.some((c) => c.parents.includes(commit.sha) && c.branch === branch.name)) {
        commit.branch = branch.name
        break
      }
    }
  })

  return {
    repo: {
      owner: repoData.owner?.login ?? owner,
      name: repoData.name,
      description: repoData.description ?? '',
      stars: repoData.stargazers_count ?? 0,
      forks: repoData.forks_count ?? 0,
      url: repoData.html_url ?? '',
    },
    branches,
    commits,
  }
}
