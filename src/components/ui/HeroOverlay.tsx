'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GalaxyData } from '@/lib/github'

interface HeroOverlayProps {
  data: GalaxyData
  visible: boolean
  onExplore: () => void
}

export default function HeroOverlay({ data, visible, onExplore }: HeroOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
          <div className="max-w-2xl mx-auto px-6 text-center pointer-events-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-panel rounded-3xl p-8 md:p-12 space-y-6"
            >
              <div className="space-y-2">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[10px] uppercase tracking-[0.2em] text-violet-400 font-mono"
                >
                  Repository Explorer
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl md:text-4xl font-bold"
                >
                  <span className="bg-gradient-to-r from-violet-300 via-cyan-300 to-pink-300 bg-clip-text text-transparent">
                    {data.repo.owner}/{data.repo.name}
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed"
                >
                  {data.repo.description}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-6 md:gap-10"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono tabular-nums text-white">
                    {data.commits.length}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                    Commits
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono tabular-nums text-white">
                    {data.branches.length}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                    Branches
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono tabular-nums text-white">
                    {data.repo.stars}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                    Stars
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono tabular-nums text-white">
                    {data.repo.forks}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                    Forks
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <button
                  onClick={onExplore}
                  className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-600/30 hover:border-violet-500/50 transition-all"
                >
                  <span className="absolute inset-0 rounded-xl bg-violet-500/5 blur-xl group-hover:bg-violet-500/20 transition-all" />
                  <span className="relative flex items-center gap-2">
                    Explore Galaxy
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <p className="text-[10px] text-zinc-600 mt-3 font-mono">
                  Click a commit star or use the timeline below
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
